import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import axios from 'axios'
import { useAppContext } from 'AppContext'

const LocationAdd: React.FC = () => {
    const [formData, setFormData] = useState({ locationName: '', locationImageName: '', file: null })
    const [isFormInvalid, setIsFormInvalid] = useState(true)
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { appConfig } = useAppContext()

    const validateForm = (newFormData) => {
        const isValid: boolean = newFormData.locationName && newFormData.locationImageName && newFormData.file
        
        console.log('validateForm', newFormData, isValid)

        setIsFormInvalid(!isValid)
    }

    const handleChange = (e) => {
        const newFormData = { ...formData, [e.target.name]: e.target.value }

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

            console.log(rsp)

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="lookup-comp relative">
            <div className="bg-slate-500 p-2 flex flex-row sticky top-11"><Link to={'/location'}><FaChevronLeft className="text-xl font-semibold text-slate-300 mt-1 mr-2" /></Link><h2 className="text-xl font-semibold text-slate-300">Add New Location</h2></div>
            <div>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <div className="lookup-form mt-4">
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Name: </label>
                            <input name="locationName" className="text-input" onChange={handleChange} />
                        </div>
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Image: </label>
                            <input name="locationImage" type="file" className="text-input" onChange={handleFileChange} />
                        </div>
                        <div>
                            {formData.locationImageName}
                            <img src={imagePreview} />
                        </div>
                    </div>
                    <button type="button" className="btn btn-blue w-20" onClick={() => save()} disabled={isFormInvalid}>Save</button>

                </form>
            </div>
        </div>
    );
};

export default LocationAdd;


