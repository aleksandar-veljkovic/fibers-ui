import { Add, Close } from "@mui/icons-material";
import { Checkbox, MenuItem, TextField } from "@mui/material"
import { createRef, useRef, useState } from "react";
import { Button } from "../button/button"

export const ItemsTable = ({ items, isEditable, onSubmit, onCancel, editEnabled }) => {
    const unitMap = {
        'g': 'Gram',
        'unit': 'Unit',
    };

    const [localItems, setLocalItems] = useState(items);

    const itemIdRef = createRef();
    const quantityUnitRef = createRef();
    const quantityValueRef = createRef();
    const isIndexedRef = createRef();
    const [isEditableFlag, setIsEditableFlag] = useState(isEditable)

    const removeItem = (index) => {
        localItems.splice(index, 1);
        setLocalItems([...localItems]);
    }

    const confirmItems = () => {
        setIsEditableFlag(false);
        onSubmit && onSubmit(localItems);
    }

    const addItem = () => {
        const itemId = itemIdRef.current.value;
        const quantityUnit = quantityUnitRef.current.value;
        const quantityValue = parseInt(quantityValueRef.current.value);
        const isIndexed = isIndexedRef.current.checked;

        console.log(isIndexed);

        if (itemId != null && quantityUnit != null && quantityValue != null) {
            setLocalItems([ {
                item_id: itemId,
                quantity_unit: quantityUnit,
                quantity_value: quantityValue,
                is_indexed: isIndexed,
            }, ...localItems]);
        }

        itemIdRef.current.value = null;
        quantityUnitRef.current.value = null;
        quantityValueRef.current.value = null;
        isIndexedRef.current.checked = true;
    }

    return (
        <div className="items-table">
            { editEnabled &&
                <div className="table-actions">
                    { isEditableFlag ?
                        <>
                            <Button className="error" title="Cancel" onClick={() => { setIsEditableFlag(false); setLocalItems(items) }}/>
                            <Button className="primary" title="Confirm" onClick={() => confirmItems()}/>
                        </>
                        :
                        <Button className="secondary" title="Edit" onClick={() => setIsEditableFlag(true)}/>
                    }
                </div>
            }
            <table>
                <thead>
                    <tr>
                        <th><span>Item ID</span></th>
                        <th><span>Unit label</span></th>
                        <th><span>Quantity</span></th>
                        <th><span>Searchable</span></th>
                        {
                        isEditableFlag && <th></th>
                        }
                    </tr>
                </thead>
                <tbody>
                {
                        isEditableFlag && 
                        <tr className="input-row">
                            <td>
                                <TextField
                                    autoComplete="off"
                                    required
                                    inputRef={itemIdRef}
                                    sx={{ width: '100%' }}
                                    label="Item ID"
                                />
                            </td>
                            <td>
                                <TextField
                                    autoComplete="off"
                                    inputRef={quantityUnitRef}
                                    required
                                    select
                                    label="Unit"
                                    sx={{ width: '100px' }}
                                >
                                    <MenuItem key='d1' value='unit'>
                                        Unit
                                    </MenuItem>

                                    <MenuItem key='d2' value='g'>
                                        Gram
                                    </MenuItem>
                                </TextField>
                            </td>
                            <td>
                                <TextField
                                    autoComplete="off"
                                    inputRef={quantityValueRef}
                                    required
                                    label="Quantity"
                                    type="number"
                                    sx={{ width: '100%'}}
                                />
                            </td>
                            <td>
                            <Checkbox defaultChecked inputRef={isIndexedRef}/>
                            </td>
                            
                            <td>
                                <Button className="primary" onClick={() => addItem()} title={<Add/>}/>
                            </td>

                        </tr>
                    }

                    {
                        localItems.map((item, index) => (
                            <tr key={`items-row-${index}`}>
                                <td>
                                    {
                                        isEditableFlag ?
                                        (
                                            <TextField
                                                defaultValue={item.item_id}
                                                required
                                                onChange={(e) => {item.item_id = e.target.value}}
                                                sx={{ width: '100%' }}
                                                key={`${item.item_id}-${index}`}
                                            />
                                        ) :
                                        (
                                            item.item_id
                                        )

                                    }
                                </td>
                                <td>
                                    {
                                     isEditableFlag ?
                                        (
                                            <TextField
                                                autoComplete="off"
                                                key={`${item.quantity_unit}-${index}`}
                                                required
                                                select
                                                onChange={(e) => {item.quantity_unit = e.target.value}}
                                                defaultValue={item.quantity_unit}
                                                sx={{ width: '100px' }}
                                            >
                                                <MenuItem key='d1' value='unit'>
                                                    Unit
                                                </MenuItem>

                                                <MenuItem key='d2' value='g'>
                                                    Gram
                                                </MenuItem>
                                            </TextField>
                                        ) :
                                        (
                                            unitMap[item.quantity_unit]
                                        )
                                    }
                                </td>
                                <td>
                                {
                                    isEditableFlag ?
                                    (
                                        <TextField
                                            autoComplete="off"
                                            defaultValue={item.quantity_value}
                                            required
                                            onChange={(e) => {item.quantity_value = parseInt(e.target.value)}}
                                            sx={{ width: '100%' }}
                                            type="number"
                                            key={`${item.quantity_value}-${index}`}
                                        />
                                    ) :
                                    (
                                        item.quantity_value       
                                    )
                                }
                                </td>
                                <td><Checkbox disabled={!isEditableFlag} defaultChecked={item.is_indexed}/></td>
                                {
                                    isEditableFlag && <td><Button onClick={() => removeItem(index)} href className="error" title={<Close/>}/></td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}