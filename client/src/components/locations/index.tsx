import { Link } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"

import LocationsList from './list'

const Locations: React.FC = () => {
    return (
    <div className="abs-container flex flex-col items-stretch justify-stretch">
        <div className="top bg-slate-500 p-2 flex flex-row items-stretch justify-stretch"><button type='button' onClick={() => history.back()}><FaChevronLeft className=" text-3xl font-semibold text-slate-300 border rounded-md p-1" /></button><span className="flex-1 text-xl font-bold text-slate-300 ml-2">Viewing Locations</span></div>
        <div className="middle relative">
            <LocationsList />
        </div>
        <div className="bottom bg-slate-500 p-2 m-1 flex flex-row items-center justify-center">
            <Link to={'/locations/add'} className="border rounded-md p-1"><FaPlus className="text-xl font-semibold text-slate-300 mr-2 inline-block" /><span className="text-lg font-semibold text-slate-300">New Location</span></Link>
        </div>
    </div>
    )
}

export default Locations


