import { IBoundingBox } from "@app/location/image";
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
    constructor(public rootServerUrl: string) { }

    async heartbeat() {
        console.log(this.rootServerUrl)
        const url = `${this.rootServerUrl}/heartbeat`

        return await axiosInstance.get(url, { timeout: 300 })
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

    async remove(item): Promise<boolean> {
        const url = `${this.rootServerUrl}/item/${item.hash}`
        
        try {
            await axiosInstance.delete(url)

            return true
        } catch {
            return false
        }
    }

    async scanImage(location: string): Promise<any> {
        const url = `${this.rootServerUrl}/location/image/${location}/analyize`
        const response = await axiosInstance.get(url)

        if(response.status === 200) {
            return response.data.boundingBoxes.map((box: any[]) => {
                console.log(box)
                const topLeft = box[0]
                const bottomRight = box[2]
                const newBox: IBoundingBox = {x: topLeft.x, y: topLeft.y, x2: bottomRight.x, y2: bottomRight.y}

                return newBox
            })
        } else {
            console.error(response)

            return []
        }
    }
}

// export const 
let dataProviderApi: DataProviderApi = null

export function useDataProvider(rootServerUrl?: string) {
    if (!dataProviderApi) dataProviderApi = new DataProviderApi(rootServerUrl)

    return dataProviderApi
}