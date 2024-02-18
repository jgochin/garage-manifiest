import ManifestItem from '@/models/manifest-item';
import Location from '@/models/locations';
import express, { Request, Response } from 'express';
import { IManifestItem } from '@/models/types';
import { createObjectId } from '@/utils';

interface ISearchResult {
    _id: string
    item: string
    locationId: string
    location: string
}

const searchRouter = express.Router();

searchRouter.get('/:criteria', async (req: Request, res: Response) => {
    try {
        const criteria = req.params.criteria;
        const matchingItems: ISearchResult[] = await ManifestItem.find({ $text: { $search: criteria } }) as ISearchResult[]
        const locationIds = matchingItems.map((item) => createObjectId(item.locationId))
        const matchingLocations = await Location.find({ _id: locationIds })
        const results: ISearchResult[] = matchingItems.reduce((agg: ISearchResult[], item: ISearchResult): ISearchResult[] => {           
            console.log(item)
            const location = matchingLocations.find((loc) => item.locationId === loc._id.toString())
            
            console.log(location)
            if (location) {
                agg.push({ _id: item._id, item: item.item, locationId: item.locationId, location: location.location })
            }
            
            console.log(agg)
            return agg 
        }, [] as ISearchResult[])
        // const results = await ManifestItem.aggregate([
        //     // { $match: { $text: { $search: criteria } } },
        //     {
        //         $lookup: {
        //             from: 'locations',
        //             localField: '_id',
        //             foreignField: 'locationId',
        //             as: 'itemLocation'
        //         }
        //     },
        //     {
        //         $project: {
        //             item: 1,
        //             locationId: 1,
        //             location: '$itemLocation.location' // Retrieve the name of the location
        //         }
        //     }
        // ])

        if (results) {
            res.status(200).json(results).end()
        } else {
            res.status(204).end()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }).end();
    }
});

export default searchRouter;
