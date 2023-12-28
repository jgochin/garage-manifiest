import React, { useEffect, useState } from 'react'
import { FaPen, FaTrash, FaBackward } from 'react-icons/fa6'
import { FaRegSave, FaRedoAlt } from 'react-icons/fa'
import { IItemListEditableProps, IListItem } from './types'
import { ITEM_UI_BUTTONS, ITEM_UI_STATE } from './constants'
import { useItemListContext } from './context'

const ListItem: React.FC<IItemListEditableProps> = ({ item, onUpdate, onUndo, onDelete, onLabelClick, isEditMode }) => {
    const { index, value, state } = item
    const [description, setDescription] = useState(value)
    const { itemList, setItemList } = useItemListContext()

    const handleValueChange = (e) => {
        setDescription(e.target.value)
    }

    const handleButtonClicks = (buttonType: number, item: IListItem) => {
        switch (buttonType) {
            case ITEM_UI_BUTTONS.SAVE:
                onUpdate({ ...item, value: description })
                break

            case ITEM_UI_BUTTONS.UNDO:
                onUndo(item)
                break

            case ITEM_UI_BUTTONS.EDIT:
                // item.state = ITEM_UI_STATE.UPDATE
                const newItem: IListItem = { ...item, state: ITEM_UI_STATE.UPDATE }
                const newItems: IListItem[] = [...itemList.items]

                newItems[item.index] = newItem

                setItemList({ ...itemList, isEditMode: true, items: newItems })
                break

            case ITEM_UI_BUTTONS.DELETE:
                onDelete(item)
                break
        }
    }

    useEffect(() => {
        if ([ITEM_UI_STATE.NEW, ITEM_UI_STATE.UPDATE].includes(state)) {
            setDescription(value)
        }
    }, [value, item.state])

    return (
        <div className="row" key={index}>
            {[ITEM_UI_STATE.READONLY, ITEM_UI_STATE.DELETE].includes(state) && (<a className="col-1" onClick={() => onLabelClick(item)}>{value}</a>)}
            {[ITEM_UI_STATE.NEW, ITEM_UI_STATE.UPDATE].includes(state) && (<span className="col-1 control-group"><input type="text" value={description} placeholder='Enter item description.' onChange={handleValueChange} /></span>)}
            {(() => {
                switch (state) {
                    case ITEM_UI_STATE.READONLY:
                        return !isEditMode && (<span className="col-2">
                            <button type="button" onClick={() => handleButtonClicks(ITEM_UI_BUTTONS.EDIT, item)}>
                                <FaPen className="text-blue-400" />
                            </button>
                            <button type="button" onClick={() => handleButtonClicks(ITEM_UI_BUTTONS.DELETE, item)}>
                                <FaTrash className="text-red-400" />
                            </button>
                        </span>)

                    case ITEM_UI_STATE.DELETE:
                        return (
                            <span className="col-2">
                                <span className="btn"><FaRedoAlt className="text-blue-500" /></span>
                            </span>
                        )
                    default:
                        return (
                            <span className="col-2">
                                <button type="button" disabled={!description} onClick={() => handleButtonClicks(ITEM_UI_BUTTONS.SAVE, item)}>
                                    <FaRegSave className="text-green-600" />
                                </button>
                                <button type="button" onClick={() => handleButtonClicks(ITEM_UI_BUTTONS.UNDO, item)}>
                                    <FaRedoAlt className="text-gray-500" />
                                </button>
                            </span>
                        );
                }
            })()}
        </div>
    );
}

export default ListItem
