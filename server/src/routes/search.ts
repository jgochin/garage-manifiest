import ManifestItem from '@/models/manifest-item';
import express, { Request, Response } from 'express';

const searchRouter = express.Router();

searchRouter.get('/:criteria', async (req: Request, res: Response) => {
    try {
        const criteria = req.params.criteria;
        const results = await ManifestItem.find({ $text: { $search: criteria }});

        if (results) {
            res.status(200).json(results).end();
        } else {            
            res.status(204).end()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }).end();
    }
});

export default searchRouter;
