import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'
import { IItemListContext, IItemListData } from './types'

// Create a context
const ItemListContext = createContext<IItemListContext | undefined>(undefined)

// Create a provider component
export const ItemListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [itemList, setItemList] = useState<IItemListData>({ items: [], isEditMode: false })

    return (
        <ItemListContext.Provider value={{ itemList, setItemList }}>
            {children}
        </ItemListContext.Provider>
    )
}

// Custom hook to consume the context
export const useItemListContext = () => {
    return useContext(ItemListContext)
}
