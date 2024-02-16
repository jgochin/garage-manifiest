import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { useItemListContext } from './context'
import ListItem from './ListItem'
import { IItemListData, IListItem, IListItemsProps } from './types'
import { ITEM_UI_STATE } from './constants'

export interface ItemListRef {
    addNewItem: () => void
}

const ItemList: React.ForwardRefRenderFunction<ItemListRef, IListItemsProps> = (props, ref) => {
    const { itemList, setItemList } = useItemListContext()

    const handleLabelClick = (item: IListItem, clickHandler: Function) => {
        if (!clickHandler || !item) return

        clickHandler(item)
    }

    const handleEditClick = (item: IListItem, clickHandler: Function) => {
        if (!clickHandler || !item) return

        clickHandler(item)
    }
    
    // Adds a new, blank item at the top of the list of items, and reindexes them.
    const addNewItem = () => {
        setItemList((prevItemList: IItemListData) => {
            try {
                const itemAdded: boolean = prevItemList.items.some(item => item.state === ITEM_UI_STATE.NEW)
                const newItem: IListItem = itemAdded ? null : { _id: '', index: 0, value: '', state: ITEM_UI_STATE.NEW }
                const newItems: IListItem[] = newItem ? [newItem, ...prevItemList.items] : [...prevItemList.items]
                const newItemList: IItemListData = { ...prevItemList, items: newItems, isEditMode: true }

                return newItemList
            } catch (err) {
                console.error(err)

                return prevItemList
            }
        });
    }

    const updateItem = async (changedItem: IListItem) => {
        try {
            const success: boolean = await props.onSave(changedItem) //dataApi.saveItem(location.name, changedItem)

            if (success) {
                const items: IListItem[] = await props.onLoad() //await dataApi.location(location.name)

                setItemList({ ...itemList, items, isEditMode: false })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const undoItem = async () => {
        const items: IListItem[] = await props.onLoad() // await dataApi.location(location.name)

        setItemList({ ...itemList, items, isEditMode: false })
    }

    const deleteItem = async (changedItem: IListItem): Promise<boolean> => {
        if (props.onBeforeDelete(changedItem)) {
            try {
                if (await props.onDelete(changedItem)) { // dataApi.remove(changedItem)
                    const items: IListItem[] = await props.onLoad() // await dataApi.location(location.name)

                    setItemList({ ...itemList, items, isEditMode: false })

                    return true
                }
            } catch (err) {
                console.error(err)
            }
        } 

        return false
    }

    useImperativeHandle(ref, () => ({
        addNewItem,
    }))

    useEffect(() => {
        const load = async () => {
            const items = await props.onLoad()

            setItemList({ ...itemList, items })
        }

        load()
    }, [])

    return (
        <div className="items">
            <div className="scroll-container">
                {itemList.items.length > 0 ? (
                    itemList.items.map((item) => <>
                        <ListItem key={item.index} onLabelClick={() => handleLabelClick(item, props.onLabelClick)} onUpdate={updateItem} onUndo={undoItem} onDelete={deleteItem} item={item} isEditMode={itemList.isEditMode} onEditClick={props.onEditClick ? (item: IListItem) => handleEditClick(item, props.onEditClick) : null} />
                    </>)
                ) : (
                    <p>No results to display.</p>
                )}
            </div>
        </div>
    )
}

export default forwardRef<ItemListRef, IListItemsProps>(ItemList)


