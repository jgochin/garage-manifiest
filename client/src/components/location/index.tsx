import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"


import { ItemListProvider } from '../ItemList/context'
// import { RiQrScan2Line } from "react-icons/ri";
import { DataProviderApi, useDataProvider } from 'data-provider-api'
import ImageWithBoundingBoxes from './image'
import { IListItem } from '@app/ItemList/types'
import ItemList, { ItemListRef } from '@app/ItemList'

const Location: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const itemListRef = useRef<ItemListRef>(null);
    const { id } = useParams()

    // const [boundingBoxes, setBoundingBoxes] = useState<IBoundingBox[]>([])

    // const handleScanClick = async () => {
    //     const boundingBoxesResult: IBoundingBox[] = await dataApi.scanImage(id)

    //     setBoundingBoxes(boundingBoxesResult)
    // }

    // Update the state when location.items changes

    const getLocationData = async (): Promise<IListItem[]> => {
        const {items, location, _id} = await dataApi.locationItems(id)

        return items
    }

    // useEffect(() => {
    //     const read = async () => {

    //         // setItemList({...itemList, items})
    //     }

    //     read()
    // }, [])

    const handleSave = async (changedItem: IListItem): Promise<boolean> => await dataApi.saveItem(changedItem._id, changedItem)
    
    const handleDelete = async (changedItem: IListItem): Promise<boolean> => await dataApi.removeItem(changedItem)
    
    const handleBeforeDelete = (changedItem: IListItem): boolean => confirm(`Are you sure you want to delete '${changedItem.value}' from '${id}'`)

    return (
        <ItemListProvider>
            <div className="location-component">
                <div className="header">
                    <button type='button' onClick={() => history.back()}>
                        <FaChevronLeft className="icon" />
                    </button>
                    <span>Location {id}</span>
                    <button type="button" onClick={() => {
                        if (itemListRef.current) {
                            itemListRef.current.addNewItem();
                        }
                    }}><FaPlus /></button>
                </div>
                <div className="body">
                    <div className="img-container">
                        <ImageWithBoundingBoxes boundingBoxes={null} imagePath={`${dataApi.locationImageUrl(id)}`} />
                    </div>
                    {/* <div className="img-bar"><button type="button" onClick={handleScanClick}><RiQrScan2Line /></button></div> */}
                    <ItemList 
                        ref={itemListRef} 
                        onLoad={() => getLocationData()} 
                        onSave={(changedItem: IListItem) => handleSave(changedItem)} 
                        onBeforeDelete={(changedItem: IListItem) => handleBeforeDelete(changedItem)}
                        onDelete={(changedItem: IListItem) => handleDelete(changedItem)}
                    />
                </div>
            </div>
        </ItemListProvider>
    )
}

export default Location


