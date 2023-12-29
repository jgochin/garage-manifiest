import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import { useAppContext } from 'AppContext'
import { DataProviderApi, useDataProvider } from 'data-provider-api';

const LocationAdd: React.FC = () => {
    const [formData, setFormData] = useState({ locationName: '', locationImageName: '', file: null })
    const [isFormInvalid, setIsFormInvalid] = useState(true)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const dataApi: DataProviderApi = useDataProvider()

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
        const requestBody: FormData = new FormData()

        requestBody.append('location', formData.locationName)
        requestBody.append('file', formData.file, formData.locationImageName)

        try {
            const status = await dataApi.saveLocation(requestBody)

            if (status === 201) {
                navigate(`/location/${formData.locationName}`, { replace: true })
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="locations-component">
            <div className="header">
                <button type='button' onClick={() => history.back()}><FaChevronLeft /></button>
                <span>Add New Location</span>
                <span className="spacer"></span>
            </div>
            <div className="body">

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="lookup-form mt-4">
                        <div className="control-group">
                            <label className="label self-center">Location Name: </label>
                            <input name="locationName" className="text-input" onChange={handleChange} />
                        </div>
                        <div className="control-group">
                            <label className="label self-center">Location Image: </label>
                            <input name="locationImage" type="file" className="text-input" onChange={handleFileChange} />
                        </div>
                    </div>
                </form>

                <div className="img-container">
                    <div className="scroll-container">
                        <img src={imagePreview} />
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" onClick={() => save()} disabled={isFormInvalid}>Save</button>
            </div>
        </div>
    );
};

export default LocationAdd;


