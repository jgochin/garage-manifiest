import { Dispatch, SetStateAction } from "react"

export interface IListItem {
    index: number
    value: any
    state?: number
    hash?: string
}

export interface IListItemProps {
    item: IListItem
    onUpdate: Function
    onUndo: Function
    onDelete: Function
    onLabelClick: Function
}

export interface IItemListEditableProps extends IListItemProps {
    isEditMode: boolean
}

export interface IItemListData {
    items: IListItem[]
    isEditMode: boolean
}

export interface IItemListContext {
    itemList: IItemListData
    setItemList: Dispatch<SetStateAction<IItemListData>>
}

export interface IListItemsProps {
    onLoad?: () => Promise<IListItem[]>
    onSave?: (changedItem: IListItem) => Promise<boolean>
    onUndo?: (changedItem: IListItem) => Promise<boolean>
    onBeforeDelete?: (changedItem: IListItem) => boolean
    onDelete?: (changedItem: IListItem) => Promise<boolean>
    onLabelClick?: (clickedItem: IListItem) => void
}

