import { IBoundingBox } from '@app/location/image'
import { IListItem } from '@app/ItemList/types'
import { ITEM_UI_STATE } from '@app/ItemList/constants'
import axiosInstance from "axiosInstance";

export interface IManifestItem {
    _id: string
    hash?: string
    item: string
    location: string
}

export interface ILocation {
    _id?: string
    location: string
    imageFileName: string
    contentType: String
    contentLength: Number
}

export interface ILocationResult extends ILocation {
    items: IListItem[]
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

    async location(id: string = ''): Promise<ILocation> {
        if (!id) return null

        const url = `${this.rootServerUrl}/location/${id}`
        const results = await axiosInstance.get(url)

        return results.data as ILocation
    }

    async locationItems(id: string): Promise<ILocationResult> {
        if (!id) throw new Error('locationItems, requires the id parameter')

        const url = `${this.rootServerUrl}/location/${id}/items`
        const results = await axiosInstance.get(url)
        const listItems = results.status === 204 ? [] : results.data.items.map((item: IManifestItem, index: number): IListItem => {
            const newItem: IListItem = { _id: item._id, index, value: item.item, state: ITEM_UI_STATE.READONLY, hash: item.hash }

            return newItem
        })
        const listItemsResult: ILocationResult = { ...results.data, items: listItems }

        return listItemsResult
    }

    locationImageUrl(location: string): string {
        return `${this.rootServerUrl}/location/${location}/image`
    }

    async saveLocation(requestBody: FormData): Promise<number | Error> {
        try {
            const url = `${this.rootServerUrl}/location/save`
            const rsp = await axiosInstance.post(url, requestBody)

            return rsp.status
        } catch (err) {
            return err
        }
    }

    async locations(): Promise<IListItem[]> {
        const url = `${this.rootServerUrl}/location`
        const results = await axiosInstance.get(url)

        const ListItems: IListItem[] = results.data.map((item: ILocation, index: number): IListItem => {
            const newItem: IListItem = { _id: item._id, index, value: item.location, state: ITEM_UI_STATE.READONLY, hash: item._id }

            return newItem
        })

        return ListItems
    }

    async search(searchCriteria: string): Promise<IManifestItem[]> {
        const url = `${this.rootServerUrl}/search/${searchCriteria}`
        const result: any = await axiosInstance.get(url)
        const searchResultItems: IManifestItem[] = result.data

        return searchResultItems
    }

    async saveItem(location: string, item: IListItem): Promise<any> {
        const url = `${this.rootServerUrl}/item`
        const payload: IManifestItem = {_id: item._id, location, item: item.value, hash: item.hash }

        if (item.state === ITEM_UI_STATE.NEW) {
            await axiosInstance.post(url, payload)

            return true
        } else {
            await axiosInstance.patch(url, payload)

            return true
        }
    }

    async removeItem(item): Promise<boolean> {
        const url = `${this.rootServerUrl}/item/${item._id}`

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