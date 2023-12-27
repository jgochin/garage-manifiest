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
    _rootServerUrl: string = ''
    heartbeatUrl: string = ''

    get rootServerUrl() {
        return this._rootServerUrl
    }

    set rootServerUrl(url: string) {
        this._rootServerUrl = `${url}/api`
        this.heartbeatUrl = `${url}/heartbeat`
    }

    constructor(rootServerUrl: string) {
        this.rootServerUrl = rootServerUrl
    }

    async heartbeat() {
        return await axiosInstance.get(this.heartbeatUrl, { timeout: 300 })
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

    locationImageUrl(location: string): string {
        return `${this.rootServerUrl}/location/image/${location}`
    }
    async saveLocation(requestBody: FormData): Promise<number | Error> {
        try {
            const url = `${this.rootServerUrl}/location/new`
            const rsp = await axiosInstance.post(url, requestBody)

            return rsp.status
        } catch (err) {
            return err
        }
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

        if (item.state === LOCATION_UI_STATE.NEW) {
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

        if (response.status === 200) {
            return response.data.boundingBoxes.map((box: any[]) => {
                console.log(box)
                const topLeft = box[0]
                const bottomRight = box[2]
                const newBox: IBoundingBox = { x: topLeft.x, y: topLeft.y, x2: bottomRight.x, y2: bottomRight.y }

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

export function useDataProvider() {
    if (!dataProviderApi) dataProviderApi = new DataProviderApi(localStorage.getItem('rootServerUrl'))

    return dataProviderApi
}