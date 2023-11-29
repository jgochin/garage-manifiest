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
                <div className="bottom bg-slate-500 p-2 flex flex-row items-center justify-center">
                    <Link to={'/location/add'} className="border rounded-md p-1"><FaPlus className="text-xl font-semibold text-slate-300 mr-2 inline-block" /><span className="text-lg font-semibold text-slate-300">Add New Location</span></Link>
                </div>
            </ div>
        </LookupProvider>
    )
}

export default Lookup

