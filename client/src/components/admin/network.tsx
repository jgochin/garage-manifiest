import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'AppContext';
import { DataProviderApi, useDataProvider } from 'data-provider-api';

const NetworkAdmin: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const { appConfig, setAppConfig } = useAppContext()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rootServerUrl: location.origin,
    })
    const [hasError, setHasError] = useState(false)

    const save = async (e) => {
        try {
            await dataApi.heartbeat()

            localStorage.setItem('rootServerUrl', formData.rootServerUrl)
            setAppConfig({ ...appConfig, rootServerUrl: formData.rootServerUrl })
            navigate('/');
        } catch (err) {
            setHasError(true)
        }
    }

    const handleChange = (e) => {
        setHasError(false)

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    return (
        <div className="lookup-comp">
            <div className="bg-slate-500 p-2"><h2 className="text-xl font-semibold text-slate-300">Setup</h2></div>
            <div className="lookup-results">
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <div className="lookup-form">
                        <label className="label">What is the Url to your server?</label>
                        <div className="flex flex-row">
                            <input name="rootServerUrl" value={formData.rootServerUrl} className="text-input" onChange={handleChange} />
                            <button type="button" className="btn btn-blue whitespace-nowrap" onClick={(e) => save(e)}>Test Connection</button>
                        </div>
                    </div>
                </form>
                {hasError ? (<div className="text-lg text-red-600">Server Not Found.</div>) : ''}
            </div>
        </div>
    );
};

export default NetworkAdmin;


