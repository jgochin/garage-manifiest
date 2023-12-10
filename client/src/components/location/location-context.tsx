import { useAppContext } from 'AppContext'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react'
import { ILocationItem, LOCATION_UI_STATE } from './item'
import { DataProviderApi, useDataProvider } from 'data-provider-api'

export interface ILocationData {
    items: ILocationItem[]
    name: string
    isEditMode: boolean
}

export interface ILocationContext {
    location: ILocationData
    setLocation: Dispatch<SetStateAction<ILocationData>>
}

// Create a context
const LocationContext = createContext<ILocationContext | undefined>(undefined)

// Create a provider component
export const LocationProvider: React.FC<{ children: ReactNode, id: string }> = ({ children, id }) => {
    const dataApi: DataProviderApi = useDataProvider()
    const [location, setLocation] = useState<ILocationData>({ name: id, items: [], isEditMode: false })

    useEffect(() => {
        const getLocationItems = async () => {
            try {
                const locationItems: ILocationItem[] = await dataApi.location(id)

                setLocation({ ...location, items: locationItems })
            } catch (error) {
                setLocation({ ...location, items: [] })
            }
        }

        getLocationItems()

        // return () => {
        //     console.log('Component will unmount or dependencies change')
        //     // You can perform cleanup here (e.g., cancel subscriptions)
        // }
    }, [])

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    )
}

// Custom hook to consume the context
export const useLocationContext = () => {
    return useContext(LocationContext)
}
