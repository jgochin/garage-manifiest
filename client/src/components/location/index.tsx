import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import LocationItems, { LocationItemsRef } from './items'
import { useAppContext } from 'AppContext'
import { LocationProvider } from './location-context'

const Location: React.FC = () => {
    const { appConfig } = useAppContext()
    const locationItemsRef = useRef<LocationItemsRef>(null);
    const { id } = useParams()

    return (
        <LocationProvider id={id}>
            <div className="location-component">
                <div className="header">
                    <button type='button' onClick={() => history.back()}>
                        <FaChevronLeft className="icon" />
                    </button>
                    <span>Location {id}</span>
                    <button type="button" onClick={() => {
                        if (locationItemsRef.current) {
                            locationItemsRef.current.addNewItem();
                        }
                    }}><FaPlus /></button>
                </div>
                <div className="body">
                    <div className="img-container">
                        <div className="">
                            <img className="" src={`${appConfig.rootServerUrl}/location/image/${id}`} />
                        </div>
                    </div>
                    <LocationItems ref={locationItemsRef} />
                </div>
            </div>
        </LocationProvider>
    )
}

export default Location


