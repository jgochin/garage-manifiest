import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import axios from 'axiosInstance'
import LocationItems from './items'
import { useAppContext } from 'AppContext'
import { LocationProvider, useLocationContext } from './location-context'

const Location: React.FC = () => {
    const { appConfig } = useAppContext()
    const { id } = useParams()

    return (
        <LocationProvider id={id}>
            <div className="location-component">
                <div className="header">
                    <button type='button' onClick={() => history.back()}>
                        <FaChevronLeft className="icon" />
                    </button>
                    <span>Location {id}</span>
                    <Link to={'/location/add-item'}><FaPlus /></Link>
                </div>
                <div className="body">
                    <div className="img-container">
                        <div className="">
                            <img className="" src={`${appConfig.rootServerUrl}/location/image/${id}`} />
                        </div>
                    </div>
                    <LocationItems />
                </div>
            </div>
        </LocationProvider>
    )
}

export default Location


