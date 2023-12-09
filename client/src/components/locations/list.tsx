import React, { useEffect, useState } from 'react'
import { useAppContext } from 'AppContext'
import axios from 'axiosInstance'
import { Link } from 'react-router-dom'

const LocationsList: React.FC = () => {
    const [locations, setLocations] = useState([])
    const { appConfig } = useAppContext()

    useEffect(() => {
        const getLocations = async () => {
            try {
                const url = appConfig.rootServerUrl + '/location'
                const rsp = await axios.get(url)

                setLocations(rsp.data)
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


