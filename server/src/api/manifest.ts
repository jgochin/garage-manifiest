import md5 from 'md5'
import Location from '@/models/locations'
import ManifestItem from '@/models/manifest-item'
import { ILocation, IManifestItem } from '@/models/types'

const getLocations = async () => {    
    return await Location.find({}, { 'location': 1 })
}

const getLocation = async (location: string): Promise<ILocation> => {
    return await Location.findOne({ location })
}

const saveLocation = async (locationData: any) => {
    const location: ILocation = new Location(locationData)

    return await location.save()
}

const getManifestItems = async (location: string) => {
    const results = await ManifestItem.find({ location })

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


