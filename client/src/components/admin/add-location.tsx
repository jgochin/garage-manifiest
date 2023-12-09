import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import axios from 'axiosInstance'
import { useAppContext } from 'AppContext'

const LocationAdd: React.FC = () => {
    const [formData, setFormData] = useState({ locationName: '', locationImageName: '', file: null })
    const [isFormInvalid, setIsFormInvalid] = useState(true)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const { appConfig } = useAppContext()

    const validateForm = (newFormData) => {
        const isValid: boolean = newFormData.locationName && newFormData.locationImageName && newFormData.file

        console.log('validateForm', newFormData, isValid)

        setIsFormInvalid(!isValid)
    }

    const handleChange = (e) => {
        const newFormData = { ...formData, [e.target.name]: e.target.value }
        const locationImageName = formData.file ? newFormData.locationName + '.' + formData.file.type.split('/')[1] : ''
        
        newFormData.locationImageName = locationImageName
        console.log('handleChange', newFormData)

        setFormData(newFormData)
        validateForm(newFormData)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const locationImageName = formData.locationName + '.' + file.type.split('/')[1]
        const newFormData = { ...formData, locationImageName, file }

        console.log('handleChange', newFormData)

        setFormData(newFormData)
        validateForm(newFormData)

        // Preview the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const save = async () => {

        const url = appConfig.rootServerUrl + '/location/new'
        const requestBody: FormData = new FormData()

        console.log('save', url, appConfig)

        requestBody.append('location', formData.locationName)
        requestBody.append('file', formData.file, formData.locationImageName)

        try {
            const rsp = await axios.post(url, requestBody)

            if(rsp.status === 201) {
                navigate(`/location/${formData.locationName}`)
            }

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="lookup-comp">
            <div className="top flex-0 bg-slate-500 p-2 flex flex-row"><Link to={'/location'}><FaChevronLeft className="text-xl font-semibold text-slate-300 mt-1 mr-2" /></Link><h2 className="text-xl font-semibold text-slate-300">Add New Location</h2></div>
            <div className="flex-1 flex flex-col">
                <form className="form flex-0" onSubmit={(e) => e.preventDefault()}>
                    <div className="lookup-form mt-4">
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Name: </label>
                            <input name="locationName" className="text-input" onChange={handleChange} />
                        </div>
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Image: </label>
                            <input name="locationImage" type="file" className="text-input" onChange={handleFileChange} />
                        </div>
                    </div>
                </form>
                <div className="img-name">{formData.locationImageName}</div>
                <div className="abs-container img-holder">
                    <img className="location-img" src={imagePreview} />
                </div>
            </div>
            <div className="flex-0 bg-slate-500 p-2 flex flex-row items-center justify-center">                  
                <button type="button" className="btn btn-blue w-20" onClick={() => save()} disabled={isFormInvalid}>Save</button>
            </div>
        </div>
    );
};

export default LocationAdd;


