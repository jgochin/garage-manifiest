import React, { useEffect } from 'react'
import axios from 'axiosInstance'
import { useAppContext } from '../../AppContext'
import { useLookupContext } from './lookup-context'
import { FaSearchengin } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const LookupForm: React.FC = () => {
    const { appConfig, setAppConfig } = useAppContext()
    const { lookupData, setLookupData } = useLookupContext()

    async function search(e) {
        if (e) e.preventDefault()

        try {
            const url = `${appConfig.rootServerUrl}/search/${appConfig.searchCriteria}`
            const results = await axios.get(url)

            setLookupData({ ...lookupData, ...{ searchResults: results.data } })
        } catch (err) {
            setLookupData({ ...lookupData, ...{ searchResults: [] } })
        }
    }

    useEffect(() => {
        search(null)
    }, [])

    return (
        <form className="lookup-form" onSubmit={(e) => search(e)}>
            <div className="control-group">
                <input value={appConfig.searchCriteria} onChange={(e) => setAppConfig({ ...appConfig, ...{ searchCriteria: e.target.value } })} />
                <button type="button" onClick={(e) => search(e)}><FaSearchengin /></button>
            </div>
        </form>
    )
}

export default LookupForm

