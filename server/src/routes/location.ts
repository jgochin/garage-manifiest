

import express, { Request, Response } from 'express'
import multer from 'multer'
import mongoose, { } from 'mongoose'
import { ILocation, IManifestItem } from '@/models/types'
import { getLocation, getLocations, getManifestItems, saveLocation } from '@/api/manifest'
import { deleteImage, findImage, getImageBuffer, getImageStream, saveImage } from '@/api/image'
import { detectObjectsInImage } from '@/api/vision'
import { objectSortAscPredicate } from '@/utils'

const locationRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

locationRouter.get('/', async (req: Request, res: Response) => {
    try {
        const results = await getLocations()

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
        const { id } = req.params
        const results = await getLocation(id)

        if (results) {
            res.status(200).json(results).end()
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

locationRouter.get('/:id/items', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const location: ILocation = await getLocation(id)
        const items: IManifestItem[] = await getManifestItems(id)

        if (items.length) {
            res.status(200).json({ ...location, items }).end()
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

locationRouter.get('/:id/image', async (req: Request, res: Response) => {
    try {
        const location: ILocation = await getLocation(req.params.id)
        const downloadStream: mongoose.mongo.GridFSBucketReadStream = getImageStream(location.imageFileName)

        res.set('Content-Type', String(location.contentType))
        res.set('Content-Length', String(location.contentLength))
        downloadStream.pipe(res)

        downloadStream.on('finish', () => {
            res.status(200).end()
        })

        downloadStream.on('error', (err) => {
            res.status(404).end()
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

locationRouter.get('/image/:location/analyize', async (req: Request, res: Response) => {
    const location: ILocation = await getLocation(req.params.location)
    const downloadStream: mongoose.mongo.GridFSBucketReadStream = getImageStream(location.imageFileName)
    const imageBuff: Buffer = await getImageBuffer(downloadStream)

    const results = await detectObjectsInImage(imageBuff)

    res.status(200).json(results)
})

locationRouter.post('/upload-image/:location', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const [_, fileExt] = req.file.mimetype.split('/')
        const location = req.params.location
        const fileName = `${location}.${fileExt}`
        const newLocation = {
            location: req.params.location,
            imageFileName: fileName,
            contentType: req.file.mimetype,
            contentLength: req.file.size
        }

        await saveImage(req.file)
        await saveLocation(newLocation as unknown as ILocation)

        res.status(201).send('Image uploaded successfully')
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
})

locationRouter.post('/save', upload.single('file'), async (req, res) => {
    const results: string[] = []
    const locationData: ILocation = req.body

    try {
        const existingLocation: ILocation = locationData._id ? await getLocation(locationData._id) : null
        const existingImage: mongoose.mongo.GridFSFile = existingLocation ? await findImage(existingLocation?.imageFileName) : null

        // Replace existing image if a new file has been supplied
        if ((existingImage && req.file)) {
            await deleteImage(existingImage._id)
            results.push('Existing image deleted')
        }

        // Save file if supplied
        if (req.file) {
            const [_, fileExt] = req.file.mimetype.split('/')

            locationData.imageFileName = `${locationData.location}.${fileExt}`
            locationData.contentType = req.file.mimetype
            locationData.contentLength = req.file.size

            await saveImage(req.file)

            results.push('New Image Saved')
        }

        locationData.isNew = !existingLocation

        await saveLocation(locationData)

        results.push('Location saved')

        res.status(201).json(results)
    } catch (error) {
        if (error.code === 11000) {    
            results.push('Loaction already exists.')        
            res.status(201).json(results)
        } else {
            res.status(500).json([error])
        }
    }
})


export default locationRouter
