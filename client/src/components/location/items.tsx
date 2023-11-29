import React from 'react'
import { useLocationContext } from './location-context'

const LocationItems: React.FC = () => {
    const { location } = useLocationContext()
    const items = location.items

    return (
        <div className="location-items">
            <div className="header">Items</div>
            <div className="list">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div className="cell" key={index}>{item}</div>
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


