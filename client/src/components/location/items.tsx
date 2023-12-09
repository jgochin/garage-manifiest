import React from 'react'
import { useLocationContext } from './location-context'
import { FaPen, FaTrash } from 'react-icons/fa6'

const LocationItems: React.FC = () => {
    const { location } = useLocationContext()
    const items = location.items

    return (
        <div className="items">
            <div className="scroll-container">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div className="row" key={index}>
                            <span className="col-1">{item}</span><span className="col-2"><span className="btn"><FaPen className="text-blue-500" /></span><span className="btn"><FaTrash className="text-red-500" /></span></span>
                        </div>
                    ))
                ) : (
                    <p>No results to display.</p>
                    // You can replace this with any message or component you want to show when there are no results.
                )}
            </div>
        </div>
    );
}

export default LocationItems


