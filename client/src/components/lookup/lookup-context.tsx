import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'

export interface ILookupData {
    searchResults: any[]
}

interface LookupResults {
    lookupData: ILookupData
    setLookupData: Dispatch<SetStateAction<ILookupData>>
}

// Create a context
const LookupContext = createContext<LookupResults | undefined>(undefined)

// Create a provider component
export const LookupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lookupData, setLookupData] = useState<ILookupData>({searchResults: []})

    return (
        <LookupContext.Provider value={{ lookupData, setLookupData }}>
            {children}
        </LookupContext.Provider>
    )
}

// Custom hook to consume the context
export const useLookupContext = () => {
    return useContext(LookupContext)
}
