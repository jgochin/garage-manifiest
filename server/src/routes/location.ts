

import ManifestItem from '@/models/manifest-item'
import express, { Request, Response } from 'express'
import multer from 'multer'
import Location from '@/models/locations'
import { Readable } from 'stream'
import mongoose, { ObjectId } from 'mongoose'
import { ILocation, IManifestItem } from '@/models/types'

const locationRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadImage = async (location: string, file: any) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    // Use Promises and async/await for better readability
    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname)
        const readableStream = new Readable()

        readableStream.push(file.buffer)
        readableStream.push(null)

        readableStream.pipe(uploadStream)

        uploadStream.on('finish', async (info) => {
            resolve(uploadStream.id)
        })

        uploadStream.on('error', (error) => {
            throw error
        })
    })
}

const findImage = async (imageFileName: string) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    try {
        const cursor = await bucket.find({ filename: imageFileName })
        const matches = await cursor.toArray()

        // This is for auto-cleanup while developing file upload.
        if (matches.length > 1) {
            await matches.forEach(async (file) => await bucket.delete(file._id))

            return null
        } else {
            return matches[0] || null
        }
    } catch (error) {
        throw error
    }
}

const deleteImage = async (id: mongoose.mongo.BSON.ObjectId) => {
    const conn = mongoose.connection
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

    await bucket.delete(id)
}

const saveLocation = async (location, file) => {

    try {
        // Create a new Image document
        const newImage = new Location({
            location,
            imageFileName: file.originalname,
            contentType: file.mimetype,
            contentLength: file.size,
        })

        // Save the Data URL to MongoDB
        await newImage.save()

    } catch (error) {
        throw error
    }
}

locationRouter.get('/', async (req: Request, res: Response) => {
    try {
        const results = await Location.find({}, { 'location': 1 })

        if (results) {
            res.status(200).json(results.sort())
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

locationRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const results = await ManifestItem.find({ location: id })

        if (results) {
            res.status(200).json(results.sort((a: IManifestItem, b: IManifestItem) => {
                if(a.item < b.item) return 1
                if (a.item < b.item) return -1

                return 0
            }))
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

locationRouter.get('/image/:location', async (req: Request, res: Response) => {
    try {
        const location: ILocation = await Location.findOne({ location: req.params.location })
        const conn = mongoose.connection
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })
        const downloadStream: mongoose.mongo.GridFSBucketReadStream = bucket.openDownloadStreamByName(location.imageFileName)

        res.set('Content-Type', String(location.contentType))
        res.set('Content-Length', String(location.contentLength))
        downloadStream.pipe(res)

        downloadStream.on('finish', () => {
            res.status(200).end()
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

locationRouter.post('/upload-image/:location', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const conn = mongoose.connection
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })

        const [fileType, fileExt] = req.file.mimetype.split('/')
        const location = req.params.location
        const fileName = `${location}.${fileExt}`
        const uploadStream = bucket.openUploadStream(fileName)
        const readableStream = new Readable()

        readableStream.push(req.file.buffer)
        readableStream.push(null)

        readableStream.pipe(uploadStream)

        uploadStream.on('finish', async () => {
            // Create a new Image document
            const newImage = new Location({
                location: req.params.location,
                imageFileName: fileName,
                contentType: req.file.mimetype,
                contentLength: req.file.size
            })

            // Save the Data URL to MongoDB
            await newImage.save()

            res.status(201).send('Image uploaded successfully')
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
})

locationRouter.post('/new', upload.single('file'), async (req, res) => {
    const results: string[] = []

    try {
        const existingLocation: ILocation = await Location.findOne({ location: req.body.location })
        const existingImage = await findImage(existingLocation?.imageFileName)

        // Replace existing image
        if (existingImage) {
            await deleteImage(existingImage._id)
            results.push('Existing image deleted')
        }

        await uploadImage(req.body.location, req.file)
        results.push('New Image Saved')

        if(existingLocation) {
            results.push('Existing location not updated.')
        } else {
            await saveLocation(req.body.location, req.file)
            results.push('New location saved')
        }

        res.status(201).json(results)
    } catch (error) {
        if (error.code === '11000') {
            results.push('New location saved')
            res.status(201).json(['Loaction already exists.'])
        } else {
            res.status(500).json([error])
        }
    }
})

export default locationRouter
