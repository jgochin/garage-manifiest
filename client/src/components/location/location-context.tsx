import { useAppContext } from 'AppContext'
import axios from 'axiosInstance'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export interface ILocationData {
    items: any[]
}

export interface ILocationContext {
    location: ILocationData
    setLocation: Dispatch<SetStateAction<ILocationData>>
}

// Create a context
const LocationContext = createContext<ILocationContext | undefined>(undefined)

// Create a provider component
export const LocationProvider: React.FC<{ children: ReactNode, id: string }> = ({ children, id }) => {
    const [location, setLocation] = useState<ILocationData>({ items: [] })
    const { appConfig } = useAppContext()

    useEffect(() => {
        const getLocationItems = async () => {
            try {
                const url = `${appConfig.rootServerUrl}/location/${id}`
                const results = await axios.get(url)

                setLocation({ ...location, items: results.data })
            } catch (error) {
                setLocation({ ...location, items: [] })
            }
        }

        getLocationItems()

        return () => {
            console.log('Component will unmount or dependencies change')
            // You can perform cleanup here (e.g., cancel subscriptions)
        }
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
