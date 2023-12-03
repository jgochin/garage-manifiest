import React, { useEffect } from 'react'
import LookupForm from './lookup-form'
import LookupResults from './lookup-results'
import { LookupProvider } from './lookup-context'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from 'AppContext'
import axiosInstance from 'axiosInstance'

const Lookup: React.FC = () => {
    const { appConfig } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        const testServerConnection = async () => {
            const url = `${appConfig.rootServerUrl}/heartbeat`

            try {
                await axiosInstance.get(url)
            } catch (err) {
                navigate('/admin/network')
            }
        }

        testServerConnection()
    }, [])

    return (
        <LookupProvider>
            <div className="lookup-comp">
                <LookupForm />
                <LookupResults />
            </ div>
        </LookupProvider>
    )
}

export default Lookup

