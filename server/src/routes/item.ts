
import express, { Request, Response } from 'express'
import md5 from 'md5'
import { deleteManifestItem, newManifestItem, updateManifestItem } from '@/api/manifest'

const itemRouter = express.Router()

itemRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { location, item } = req.body
        const newItem: any = { ...req.body, hash: md5(location + item) }
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
        await deleteManifestItem(req.params.hash) 

        res.status(201).end()
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' }).end()
    }
})

export default itemRouter


