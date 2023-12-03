import React, { useEffect } from 'react'
import axios from 'axiosInstance'
import { useAppContext } from '../../AppContext'
import { useLookupContext } from './lookup-context'
import { FaPlus, FaTableList } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const LookupForm: React.FC = () => {
    const { appConfig, setAppConfig } = useAppContext()
    const { lookupData, setLookupData } = useLookupContext()
    
    async function search(e) {
        if(e) e.preventDefault()

        try {
            const url = `${appConfig.rootServerUrl}/search/${appConfig.searchCriteria}`
            const results = await axios.get(url)

            setLookupData({...lookupData, ...{searchResults: results.data}})
        } catch (err) {
            setLookupData({ ...lookupData, ...{ searchResults: [] } })
        }
    }

    useEffect(() => {
        search(null)
    }, [])

    return (
        <div>
            <div className="bg-slate-500 p-2 mb-4 top flex flex-row justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-300">What are you looking for?</h2>
                <div className="bottom bg-slate-500 p-2 flex flex-row items-center justify-center">
                    <Link to={'/locations'} className="border rounded-md p-1"><FaTableList className="text-xl font-semibold text-slate-300 mr-2 inline-block" /><span className="text-lg font-semibold text-slate-300">View Locations</span></Link>
                </div>
            </div>
            <form className="form" onSubmit={(e) => search(e)}>
                <div className="lookup-form">
                    <div className="flex flex-row">
                        <input value={appConfig.searchCriteria} className="text-input" onChange={(e) => setAppConfig({ ...appConfig, ...{ searchCriteria: e.target.value } })} />
                        {/* <button type="button" className="btn btn-blue" onClick={(e) => search(e)}>Search</button> */}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LookupForm

