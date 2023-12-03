

import ManifestItem from '@/models/manifest-item'
import express, { Request, Response } from 'express'
import multer from 'multer'
import Location from '@/models/locations'
import { Readable } from 'stream'
import mongoose from 'mongoose'
import { ILocation } from '@/models/types'
import mimeTypes from 'mime-types'

const locationRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
            res.status(200).json(results.map(location => location.item).sort())
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

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

        uploadStream.on('finish', async () => {
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

                resolve('Image uploaded successfully')
            } catch (error) {
                reject(error)
            }
        })

        uploadStream.on('error', (error) => {
            reject(error)
        })
    })
}

locationRouter.get('/image/:location', async (req:Request, res: Response) => {
    try {
        const location: ILocation = await Location.findOne({location: req.params.location})
        const conn = mongoose.connection
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'locationImages' })


        
        const downloadStream: mongoose.mongo.GridFSBucketReadStream = bucket.openDownloadStreamByName(location.imageFileName)
        const contentType = mimeTypes.lookup(location.imageFileName) || 'application/octet-stream'
        
        res.set('Content-Type', String(location.contentType))
        res.set('Content-Length', String(location.contentLength))
        downloadStream.pipe(res)

        downloadStream.on('finish', () => {
            res.status(200).end()
        })
    } catch(err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

locationRouter.post('/upload-image/:location', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const conn = mongoose.connection
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'locationImages'})

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
    console.log(req.body.location, req.file)
    try {
        await uploadImage(req.body.location, req.file)

        res.status(201).send('Image uploaded successfully')
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

export default locationRouter
