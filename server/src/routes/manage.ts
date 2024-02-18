import ManifestItem from '@/models/manifest-item';
import { IManifestItem } from '@/models/types';
import express, { Request, Response } from 'express';
import md5 from 'md5'

const manageRouter = express.Router();

manageRouter.get('/list', async (req: Request, res: Response) => {
    try {
        const results = await ManifestItem.find();

        if (results) {
            res.status(200).json(results);
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

manageRouter.post('/add-many', async (req: Request, res: Response) => {
    try {
        const items = req.body;
        const results = await ManifestItem.insertMany(items);

        if (results) {
            res.status(200).json(results);
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

manageRouter.post('/import', async (req: Request, res: Response) => {
    try {
        const rawLines: string[] = req.body.split('\n')
        const tupleLines: string[][] = rawLines.map(line => line.split('\t'))
        const objLines: IManifestItem[] = tupleLines.map(([locationId, item]) => { return { locationId, item } as IManifestItem})

        const bulkOps = objLines.map((data: IManifestItem) => ({
            updateOne: {
                filter: { _id: data.locationId },
                update: { $set: data },
                upsert: true,
            },
        }));

        const results = await ManifestItem.bulkWrite(bulkOps)

        if (results) {
            res.status(200).json(results);
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default manageRouter;