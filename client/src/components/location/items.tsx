import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { ILocationData, useLocationContext } from './location-context'
import LocationItem, { ILocationItem, LOCATION_UI_STATE } from './item'
import { DataProviderApi, useDataProvider } from 'data-provider-api'

export interface LocationItemsRef {
    addNewItem: () => void
}

const LocationItems: React.ForwardRefRenderFunction<LocationItemsRef, {}> = (props, ref) => {
    const dataApi: DataProviderApi = useDataProvider()
    const { location, setLocation } = useLocationContext()
    const [items, setItems] = useState(location.items)

    // Adds a new, blank item at the top of the list of items, and reindexes them.
    const addNewItem = () => {
        setLocation((prevLocation: ILocationData) => {
            try {
                const itemAdded: boolean = prevLocation.items.some(item => item.state === LOCATION_UI_STATE.NEW)
                const newItem: ILocationItem = itemAdded ? null : { index: 0, value: '', state: LOCATION_UI_STATE.NEW }
                const newItems: ILocationItem[] = newItem ? [newItem, ...prevLocation.items] : [...prevLocation.items]
                const newLocation: ILocationData = { ...prevLocation, items: newItems, isEditMode: true }
                return newLocation
            } catch (err) {
                console.info(err)

                return prevLocation
            }
        });
    }

    const updateItem = async (changedItem: ILocationItem) => {
        try {            
            const success: boolean = await dataApi.saveItem(location.name, changedItem)
            
            if (success) {
                const items: ILocationItem[] = await dataApi.location(location.name)

                setLocation({...location, items, isEditMode: false})
            }
        } catch (err) {
            console.error(err)
        }
    }

    const undoItem = async () => {
        const items: ILocationItem[] = await dataApi.location(location.name)

        setLocation({ ...location, items, isEditMode: false })
    }

    const deleteItem = async (changedItem: ILocationItem) => {
        if(confirm(`Are you sure you want to delete '${changedItem.value}'`)) {
            try {
                const success: boolean = await dataApi.remove(changedItem)

                const items: ILocationItem[] = await dataApi.location(location.name)

                setLocation({ ...location, items, isEditMode: false })
            } catch (err) {
                console.error(err)
            }
        } else {
            return
        }



    }

    useImperativeHandle(ref, () => ({
        addNewItem,
    }))

    // Update the state when location.items changes
    useEffect(() => {
        setItems(location.items)
    }, [location.items])

    return (
        <div className="items">
            <div className="scroll-container">
                {items.length > 0 ? (
                    items.map((item) => <>
                        <LocationItem key={item.index} onUpdate={updateItem} onUndo={undoItem} onDelete={deleteItem} item={item} />
                    </>)
                ) : (
                    <p>No results to display.</p>                    
                )}
            </div>
        </div>
    )
}

export default forwardRef<LocationItemsRef, {}>(LocationItems)


