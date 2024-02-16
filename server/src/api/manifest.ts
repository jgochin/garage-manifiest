import md5 from 'md5'
import Location from '@/models/locations'
import ManifestItem from '@/models/manifest-item'
import { ILocation, IManifestItem } from '@/models/types'
import mongoose from 'mongoose'

const getLocations = async () => {
    return await Location.find({}, { 'location': 1 }, { versionKey: false })
}

const getLocation = async (location: string): Promise<ILocation> => {
    const id: mongoose.Types.ObjectId = mongoose.Types.ObjectId.isValid(location) ? new mongoose.Types.ObjectId(location) : undefined
    const filter: any = id ? { _id: id } : { location }
    const foundLocation: ILocation = await Location.findOne(filter)

    return foundLocation?.toObject({ versionKey: false })
}

const saveLocation = async (locationData: ILocation) => {
    const location: ILocation = new Location(locationData)

    location.isNew = locationData.isNew

    return await location.save()
}

const getManifestItems = async (location: string) => {
    const results = await ManifestItem.find({ location }, { __v: 0 })

    return results.sort((a: IManifestItem, b: IManifestItem) => {
        if (a.item < b.item) return 1
        if (a.item < b.item) return -1

        return 0
    })
}

const newManifestItem = async (item: any) => {
    const newItem: IManifestItem = new ManifestItem({ ...item, hash: md5(item.location + item.item), isNew: true })

    return await newItem.save()
}

const updateManifestItem = async (item: any) => {
    const existingItem: any = await ManifestItem.findOne({ hash: item.hash })

    return await ManifestItem.updateOne({ _id: existingItem._id }, { item: item.item, hash: md5(item.location + item.item) })
}

const deleteManifestItem = async (hash: string) => {
    return await ManifestItem.deleteOne({ hash })
}

export { getLocation, saveLocation, getLocations, getManifestItems, newManifestItem, updateManifestItem, deleteManifestItem }


