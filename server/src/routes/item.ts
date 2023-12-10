
import express, { Request, Response } from 'express'
import md5 from 'md5'
import ManifestItem from '@/models/manifest-item'
import { IManifestItem } from '@/models/types'

const itemRouter = express.Router()

itemRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { location, item } = req.body
        const newItem: IManifestItem = { ...req.body, hash: md5(location + item) }
        const results = await ManifestItem.insertMany([newItem])

        if (results) {
            res.status(201).end()
        } else {
            res.status(404).send(res.statusMessage).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

itemRouter.patch('/', async (req: Request, res: Response) => {
    try {
        const newItem: IManifestItem = req.body
        const existingItem: any = await ManifestItem.findOne({hash: newItem.hash})
        const results = await ManifestItem.updateOne({ _id: existingItem._id }, { item: newItem.item, hash: md5(newItem.location + newItem.item) })

        if (results) {
            res.status(201).end()
        } else {
            res.status(404).send(res.statusMessage).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

itemRouter.delete('/:hash', async (req: Request, res: Response) => {
    try {
        await ManifestItem.deleteOne({ hash: req.params.hash })

        res.status(201).end()
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' }).end()
    }
})

export default itemRouter


