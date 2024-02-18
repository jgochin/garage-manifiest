import md5 from 'md5'
import Location from '@/models/locations'
import ManifestItem from '@/models/manifest-item'
import { ILocation, IManifestItem } from '@/models/types'
import mongoose from 'mongoose'
import { createObjectId } from '@/utils'
import { deleteImage, findImage } from './image'

class LocationError extends Error { 
    status: number

    constructor(message: string, status: number = 500) {
        super(message)

        this.status = status
    }
}

const getLocations = async () => {
    return await Location.find({}, { 'location': 1 }, { versionKey: false })
}

const getLocation = async (location: string): Promise<ILocation> => {
    const id: mongoose.Types.ObjectId = createObjectId(location)
    const filter: any = id ? { _id: id } : { location }
    const foundLocation: ILocation = await Location.findOne(filter)

    return foundLocation?.toObject({ versionKey: false })
}

const saveLocation = async (locationData: ILocation) => {
    const location: ILocation = new Location(locationData)

    location.isNew = locationData.isNew

    return await location.save()
}

const getManifestItems = async (locationId: string) => {
    const results = await ManifestItem.find({ locationId }, { __v: 0 })

    return results.sort((a: IManifestItem, b: IManifestItem) => {
        if (a.item < b.item) return 1
        if (a.item < b.item) return -1

        return 0
    })
}

const newManifestItem = async (item: any) => {
    const newItem: IManifestItem = new ManifestItem({ ...item, isNew: true })

    return await newItem.save()
}

const updateManifestItem = async (item: any) => {
    const existingItem: any = await ManifestItem.findOne({ _id: item._id })

    return await ManifestItem.updateOne({ _id: existingItem._id }, { item: item.item})
}

const deleteManifestItem = async (id: string) => {
    return await ManifestItem.deleteOne({ _id: id })
}

const deleteManifestItems = async (locationId: string) => {
    return await ManifestItem.deleteMany({location: locationId})
}

const deleteLocation = async (id: string) => {
    const location: ILocation = await getLocation(id)
    const session = await mongoose.startSession()

    try {
        if (!location) throw new LocationError(`Location ${id} not found`, 404)

        const existingImage: mongoose.mongo.GridFSFile = location ? await findImage(location?.imageFileName) : null

        await session.startTransaction()

        console.info(`Deleting location: ${location.location} (${id})`)

        if(existingImage) {
            const deleteResult = await deleteImage(existingImage._id)
            console.info(`Location image deleted: ${existingImage.filename}`, deleteResult)
        } else {
            console.info(`Location image not found... continuing`)
        }

        const deleteItemsResult = await deleteManifestItems(id)
        console.info(`Location items deleted.`, deleteItemsResult)

        await Location.deleteOne({ _id: location._id })

        await session.commitTransaction()

        return `Location: ${location.location} (${id}) deleted.`
    } catch (error) {
        if(session.inTransaction()) await session.abortTransaction()

        if (error instanceof LocationError) {
            throw error
        } else {
            throw new LocationError(`Failed to delete location ${location?.location || ''} (${id}): ${error.message}`)
        }
    } finally {
        if(location) session.endSession()              
    }
}


export { 
    getLocation, saveLocation, 
    getLocations, getManifestItems, 
    newManifestItem, updateManifestItem, 
    deleteManifestItem, deleteManifestItems,
    deleteLocation,
}


