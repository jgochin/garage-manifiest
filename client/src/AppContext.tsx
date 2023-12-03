import axiosInstance from 'axiosInstance';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IAppConfigData {
    rootServerUrl: string
    searchCriteria: string
}

export interface IAppConfig {
    appConfig: IAppConfigData;
    setAppConfig: Dispatch<SetStateAction<IAppConfigData>>;
}

// Create a context
const AppContext = createContext<IAppConfig|undefined>(undefined);
const rootServerUrl: string = localStorage.getItem('rootServerUrl') || location.origin

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appConfig, setAppConfig] = useState<IAppConfigData>({ rootServerUrl, searchCriteria: '' })
    
    return (
        <AppContext.Provider value={{appConfig, setAppConfig}}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to consume the context
export const useAppContext = () => {
    return useContext(AppContext);
};


