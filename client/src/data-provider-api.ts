import { ILocationItem, LOCATION_UI_STATE } from "@app/location/item";
import axiosInstance from "axiosInstance";

export interface IManifestItem {
    hash?: string
    item: string
    location: string
}

export interface ILocation {
    _id: string
    location: string
}

export class DataProviderApi {
    constructor(private rootServerUrl: string) { }

    heartbeat() {
        const url = `${this.rootServerUrl}/heartbeat`

        return axiosInstance.get(url, { timeout: 300 })
    }

    async location(id: string = ''): Promise<ILocationItem[]> {
        const url = `${this.rootServerUrl}/location/${id}`
        const results = await axiosInstance.get(url)
        const locationItems: ILocationItem[] = results.data.map((item: IManifestItem, index: number): ILocationItem => {
            const newItem: ILocationItem = { index, value: item.item, state: LOCATION_UI_STATE.READONLY, hash: item.hash }

            return newItem
        })

        return locationItems
    }

    async locations(): Promise<ILocation[]> {
        const url = `${this.rootServerUrl}/location`
        const results = await axiosInstance.get(url)
        const locations: ILocation[] = results.data

        return locations
    }

    async search(searchCriteria: string): Promise<IManifestItem[]> {
        const url = `${this.rootServerUrl}/search/${searchCriteria}`
        const result: any = await axiosInstance.get(url)
        const searchResultItems: IManifestItem[] = result.data

        console.log(searchResultItems)
        return searchResultItems
    }

    async saveItem(location: string, item: ILocationItem): Promise<any> {
        const url = `${this.rootServerUrl}/item`
        const payload: IManifestItem = { location, item: item.value, hash: item.hash }

        if(item.state === LOCATION_UI_STATE.NEW) {
            await axiosInstance.post(url, payload)

            return true
        } else {
            await axiosInstance.patch(url, payload)

            return true
        }
    }

    async remove(item) {
        const url = `${this.rootServerUrl}/item/${item.hash}`
        
        try {
            await axiosInstance.delete(url)

            return true
        } catch {
            return false
        }
    }
}

// export const 
let dataProviderApi: DataProviderApi = null

export function useDataProvider(rootServerUrl?: string) {
    if(!rootServerUrl) {
        rootServerUrl = localStorage.getItem('rootServerUrl')
    }

    if (!dataProviderApi) dataProviderApi = new DataProviderApi(rootServerUrl)

    return dataProviderApi
}