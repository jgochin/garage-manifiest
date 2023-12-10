import React, { useEffect } from 'react'
import { useAppContext } from '../../AppContext'
import { useLookupContext } from './lookup-context'
import { FaSearchengin } from 'react-icons/fa6'
import { DataProviderApi, IManifestItem, useDataProvider } from 'data-provider-api'

const LookupForm: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const { appConfig, setAppConfig } = useAppContext()
    const { lookupData, setLookupData } = useLookupContext()

    async function search(e) {
        if (e) e.preventDefault()

        try {
            const searchResults: IManifestItem[] = await dataApi.search(appConfig.searchCriteria)

            setLookupData({ ...lookupData, ...{ searchResults } })
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

