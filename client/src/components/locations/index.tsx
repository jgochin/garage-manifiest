import { Link, useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import ItemList, { ItemListRef } from '@app/ItemList'
import { useRef } from 'react';
import { IListItem } from '@app/ItemList/types';
import { DataProviderApi, useDataProvider } from 'data-provider-api';
import { ItemListProvider } from '@app/ItemList/context';

const Locations: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const itemListRef = useRef<ItemListRef>(null);
    const navigate = useNavigate()

    const getLocationsData = async (): Promise<IListItem[]> => {
        const items: IListItem[] = await dataApi.locations()

        return items
    }

    const handleLabelClick = (item: IListItem) => {
        const url = `/location/${item.value}`
        
        navigate(url)
    }

    // const handleSave = async (changedItem: IListItem): Promise<boolean> => await dataApi.saveItem(id, changedItem)
    // const handleDelete = async (changedItem: IListItem): Promise<Boolean> => dataApi.remove(changedItem)

    return (
        <div className="locations-component">
            <div className="header">
                <button type='button' onClick={() => history.back()}><FaChevronLeft /></button>
                <span>Viewing Locations</span>
                <Link to={'/locations/add'} className="border rounded-md p-1"><FaPlus /></Link>
            </div>
            <div className="body">
                <ItemListProvider>
                    <ItemList
                        ref={itemListRef}
                        onLoad={() => getLocationsData()}
                        onLabelClick={(item: IListItem) => handleLabelClick(item)}
                    // onSave={(changedItem: IListItem) => handleSave(changedItem)}
                    // onBeforeDelete={(changedItem: IListItem) => handleBeforeDelete(changedItem)}
                    // onDelete={(changedItem: IListItem) => handleDelete(changedItem)}
                    />
                </ItemListProvider>
            </div>
        </div>
    )
}

export default Locations


