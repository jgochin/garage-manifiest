import React, { useEffect } from 'react'
import LookupForm from './lookup-form'
import LookupResults from './lookup-results'
import { LookupProvider } from './lookup-context'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from 'AppContext'
import { FaPlus } from 'react-icons/fa6'

const Lookup: React.FC = () => {
    const navigate = useNavigate()
    const { appConfig, setAppConfig } = useAppContext()
    const rootServerUrl: string = localStorage.getItem('rootServerUrl')

    useEffect(() => {
        if (!rootServerUrl && !appConfig.rootServerUrl) {
            navigate('/admin/network')
        } else {
            setAppConfig({ ...appConfig, rootServerUrl })
        }
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

