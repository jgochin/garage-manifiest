import React, { useEffect } from 'react'
import LookupForm from './lookup-form'
import LookupResults from './lookup-results'
import { LookupProvider } from './lookup-context'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from 'AppContext'
import { FaTableList } from 'react-icons/fa6'
import { DataProviderApi, useDataProvider } from 'data-provider-api'

const Lookup: React.FC = () => {
    const { appConfig } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        const dataApi: DataProviderApi = useDataProvider(appConfig.rootServerUrl)

        const testServerConnection = async () => {
            try {
                await dataApi.heartbeat()
            } catch (err) {
                navigate('/admin/network')
            }
        }

        testServerConnection()
    }, [])

    return (
        <LookupProvider>
            <div className="lookup-component">
                <div className="header">
                    <div className="spacer"></div>
                    <div>What are you looking for?</div>
                    <Link to={'/locations'}><FaTableList className="" /></Link>
                </div>
                <div className="body">
                    <LookupForm />
                    <LookupResults />
                </div>
            </ div>
        </LookupProvider>
    )
}

export default Lookup

