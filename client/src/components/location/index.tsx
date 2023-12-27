import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaPlus } from "react-icons/fa6"
import LocationItems, { LocationItemsRef } from './items'
import { useAppContext } from 'AppContext'
import { LocationProvider } from './location-context'
import { RiQrScan2Line } from "react-icons/ri";
import { DataProviderApi, useDataProvider } from 'data-provider-api'
import ImageWithBoundingBoxes, { IBoundingBox } from './image'

const Location: React.FC = () => {
    const dataApi: DataProviderApi = useDataProvider()
    const { appConfig } = useAppContext()
    const locationItemsRef = useRef<LocationItemsRef>(null);
    const { id } = useParams()
    const [boundingBoxes, setBoundingBoxes] = useState<IBoundingBox[]>([])

    const handleScanClick = async () => {
        const boundingBoxesResult: IBoundingBox[] = await dataApi.scanImage(id)

        setBoundingBoxes(boundingBoxesResult)
    }

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
                        <ImageWithBoundingBoxes boundingBoxes={boundingBoxes} imagePath={`${appConfig.rootServerUrl}/location/image/${id}`} />
                    </div>
                    <div className="img-bar"><button type="button" onClick={handleScanClick}><RiQrScan2Line /></button></div>
                    <LocationItems ref={locationItemsRef} />
                </div>
            </div>
        </LocationProvider>
    )
}

export default Location


