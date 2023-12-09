import { Link } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"

import LocationsList from './list'

const Locations: React.FC = () => {
    return (
        <div className="locations-component">
            <div className="header">
                <button type='button' onClick={() => history.back()}><FaChevronLeft /></button>
                <span>Viewing Locations</span>
                <Link to={'/locations/add'} className="border rounded-md p-1"><FaPlus /></Link>
            </div>
            <div className="body">
                <LocationsList />
            </div>
        </div>
    )
}

export default Locations


