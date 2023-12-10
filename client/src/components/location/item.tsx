import React, { useEffect, useState } from 'react'
import { FaPen, FaTrash, FaBackward } from 'react-icons/fa6'
import { FaRegSave, FaRedoAlt } from "react-icons/fa";
import { ILocationData, useLocationContext } from './location-context';

export class LOCATION_UI_STATE {
    static READONLY: number = 0
    static UPDATE: number = 1
    static NEW: number = 2
    static DELETE: number = 3
}

export class LOCATION_UI_BUTTONS {
    static SAVE: number = 0
    static UNDO: number = 1
    static DELETE: number = 2
    static EDIT: number = 3
}

export interface ILocationItem {
    index: number
    value: any
    state?: number
    hash?: string
}

export interface ILocationItemProps {
    item: ILocationItem
    onUpdate: Function
    onUndo: Function
    onDelete: Function
}

const LocationItem: React.FC<ILocationItemProps> = ({item, onUpdate, onUndo, onDelete}) => {
    const { index, value, state } = item
    const [description, setDescription] = useState(value)
    const { location, setLocation } = useLocationContext()

    const handleValueChange = (e) => {
        setDescription(e.target.value)
    }

    const handleButtonClicks = (buttonType: number, item: ILocationItem) => {
        switch(buttonType) {
            case LOCATION_UI_BUTTONS.SAVE:
                onUpdate({...item, value: description})
                break
            case LOCATION_UI_BUTTONS.UNDO:
                onUndo(item)
                break
            case LOCATION_UI_BUTTONS.EDIT:
                // item.state = LOCATION_UI_STATE.UPDATE
                const newItem: ILocationItem = { ...item, state: LOCATION_UI_STATE.UPDATE }
                const newItems: ILocationItem[] = [...location.items]

                newItems[item.index] = newItem

                setLocation({ ...location, items: newItems})
                break
            case LOCATION_UI_BUTTONS.DELETE:
                onDelete(item)
        }
    }

    useEffect(() => {
        if([LOCATION_UI_STATE.NEW, LOCATION_UI_STATE.UPDATE].includes(state)) {
            setDescription(value)
        }
    }, [value, item.state])

    return (
        <div className="row" key={index}>
            {[LOCATION_UI_STATE.READONLY, LOCATION_UI_STATE.DELETE].includes(state) && (<span className="col-1">{value}</span>)}
            {[LOCATION_UI_STATE.NEW, LOCATION_UI_STATE.UPDATE].includes(state) && (<span className="col-1 control-group"><input type="text" value={description} placeholder='Enter item description.' onChange={handleValueChange} /></span>)}
            {(() => {
                switch (state) {
                    case LOCATION_UI_STATE.READONLY:
                        return !location.isEditMode && (<span className="col-2">
                            <button type="button" onClick={() => handleButtonClicks(LOCATION_UI_BUTTONS.EDIT, item)}>
                                <FaPen className="text-blue-400" />
                            </button>
                            <button type="button" onClick={() => handleButtonClicks(LOCATION_UI_BUTTONS.DELETE, item)}>
                                <FaTrash className="text-red-400" />
                            </button>
                        </span>)

                    case LOCATION_UI_STATE.DELETE:
                        return (
                            <span className="col-2">
                                <span className="btn"><FaRedoAlt className="text-blue-500" /></span>
                            </span>
                        )
                    default:
                        return (
                            <span className="col-2">
                                <button type="button" disabled={!description} onClick={() => handleButtonClicks(LOCATION_UI_BUTTONS.SAVE, item)}>
                                    <FaRegSave className="text-green-600" />
                                </button>
                                <button type="button" onClick={() => handleButtonClicks(LOCATION_UI_BUTTONS.UNDO, item)}>
                                    <FaRedoAlt className="text-gray-500" />
                                </button>
                            </span>
                        );
                }
            })()}
        </div>
    );
}

export default LocationItem
