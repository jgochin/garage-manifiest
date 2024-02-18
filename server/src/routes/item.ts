
import express, { Request, Response } from 'express'
import { deleteManifestItem, newManifestItem, updateManifestItem } from '@/api/manifest'
import { createObjectId } from '@/utils'

const itemRouter = express.Router()

itemRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { locationId, item } = req.body
        const newItem: any = { locationId: createObjectId(locationId), item }
        const results = await newManifestItem(newItem)

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
        const newItem: any = req.body
        const results = await updateManifestItem(newItem)

        if (results) {
            res.status(204).end()
        } else {
            res.status(404).send(res.statusMessage).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

itemRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await deleteManifestItem(req.params.id)

        res.status(204).end()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' }).end()
    }
})

export default itemRouter


