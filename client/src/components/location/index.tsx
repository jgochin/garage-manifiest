import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import axios from 'axios'
import LocationItems from './items'
import { useAppContext } from 'AppContext'
import { LocationProvider, useLocationContext } from './location-context'

const Location: React.FC = () => {
    const { appConfig } = useAppContext()
    const { id } = useParams()

    return (
        <LocationProvider id={id}>
            <div className="abs-container flex flex-col items-stretch justify-stretch">
                <div className="top bg-slate-500 p-2 flex flex-row items-stretch justify-stretch"><button type='button' onClick={() => history.back()}><FaChevronLeft className=" text-3xl font-semibold text-slate-300 border rounded-md p-1" /></button><span className="flex-1 text-xl font-bold text-slate-300 ml-2">Viewing Location: {id}</span></div>
                <div className="top p-4 min-h-lg"><img className="" src={`${appConfig.rootServerUrl}/location/image/${id}`} /></div>
                <div className="middle relative">
                    <LocationItems />
                </div>
                <div className="bottom bg-slate-500 p-2 m-1 flex flex-row items-center justify-center">
                    <Link to={'/location/add-item'} className="border rounded-md p-1"><FaPlus className="text-xl font-semibold text-slate-300 mr-2 inline-block" /><span className="text-lg font-semibold text-slate-300">New Item</span></Link>
                </div>
            </div>
        </LocationProvider>
    )
}

export default Location


