import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataProviderApi, ILocation, useDataProvider } from 'data-provider-api'

const LocationsList: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const [locations, setLocations] = useState([])

    useEffect(() => {
        const getLocations = async () => {
            try {
                const locationResults: ILocation[] = await dataApi.locations()

                setLocations(locationResults)
            } catch (err) {
                console.error(err)
                setLocations([])
            }
        }

        getLocations()

    }, [])

    return (
        <div className="items">
            <div>
                {locations.length > 0 ? (
                    locations.map((item, index) => (
                        <div className="cell" key={item._id}><Link to={`/location/${item.location}`}>{item.location}</Link></div>
                    ))
                ) : (
                    <p>No results to display.</p>
                    // You can replace this with any message or component you want to show when there are no results.
                )}
            </div>
        </div>
    );
}

export default LocationsList


