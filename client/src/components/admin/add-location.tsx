import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import axios from 'axios'

const LocationAdd: React.FC = () => {
    const [formData, setFormData] = useState({ locationName: '', locationImageName: '', file: null })
    const [isFormInvalid, setIsFormInvalid] = useState(true)

    const validateForm = () => {
        setIsFormInvalid(!formData.locationImageName || !formData.file)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        validateForm()      
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] })
        validateForm()
    }

    const save = async () => {
        console.log('Save Location')
        console.log(formData)
    }

    return (
        <div className="lookup-comp relative">
            <div className="bg-slate-500 p-2 flex flex-row sticky top-11"><Link to={'/location'}><FaChevronLeft className="text-xl font-semibold text-slate-300 mt-1 mr-2" /></Link><h2 className="text-xl font-semibold text-slate-300">Add New Location</h2></div>
            <div>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <div className="lookup-form mt-4">
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Name: </label>
                            <input name="locationName" value={formData.locationName} className="text-input" onChange={handleChange} />
                        </div>
                        <div className="flex flex-row justify-items-stretch">
                            <label className="label self-center">Location Image: </label>
                            <input name="locationImage" type="file" value={formData.file} className="text-input" onChange={handleFileChange} />
                        </div>
                    </div>
                    <button type="button" className="btn btn-blue w-20" onClick={() => save()} disabled={isFormInvalid}>Save</button>

                </form>
            </div>
        </div>
    );
};

export default LocationAdd;


