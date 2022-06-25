import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ShipmentContext } from "../../contexts/shipment-context";
import { Button } from "../../shared-components/button/button";
import { ItemsTable } from "../../shared-components/items-table/items-table";
import { Panel } from "../../shared-components/panel/panel";
import { MenuItem, TextField } from "@mui/material";
import { DatePicker } from "../../shared-components/date-picker/date-picker";
import { PartnerContext } from "../../contexts/partner-context";
import { UserContext } from "../../contexts/user-context";

export const EditShipmentPage = () => {
    const { allShipments, updateItems, fetchSingleShipment, publishShipment, updateShipment, confirmShipment } = useContext(ShipmentContext);
    let { shipmentLabel } = useParams();
    const { user } = useContext(UserContext);
    const { partners } = useContext(PartnerContext);

    let myCompanyId, myDepartmentId;

    if (user != null) {
        myCompanyId = user.companyId;
        myDepartmentId = user.departmentId;
    }
    
    const shipment = allShipments != null ? allShipments.find(s => s.label === shipmentLabel) : null;
    const [localShipment, setLocalShipment] = useState(null);

    useEffect(() => {
        if ((localShipment == null || localShipment.status != shipment.status) && shipment != null) {
            fetchSingleShipment(shipment.id).then((singleShipment) => {
                setLocalShipment({ ...singleShipment })
            });
        }
    }, [shipment]);

    const isMyShipment = shipment != null && shipment.shipment_creator === myDepartmentId;
    const isSentShipment = shipment != null && shipment.source_company === myCompanyId && shipment.source_department === myDepartmentId;
    const isClosed = shipment ? shipment.status === 'CONFIRMED' : false;

    if (localShipment && isSentShipment && shipment.sending_date == null) {
        localShipment.sending_date = new Date().toISOString();
    }

    if (localShipment && !isSentShipment && shipment.receiving_date == null) {
        localShipment.receiving_date = new Date().toISOString();
    }

    const updateShipmentItems = (items) => {
        updateItems(
            localShipment.id, 
            items.map(item => (
                { 
                    item_id: item.item_id, 
                    quantity_unit: item.quantity_unit,
                    quantity_value: item.quantity_value,
                    is_indexed: item.is_indexed,
                    shipment_id: localShipment.id,
                })
            )
        ).then(() => {
            fetchSingleShipment(shipment.id).then((singleShipment) => {
                setLocalShipment({ ...singleShipment })
            });
        })
    }

    const publishCurrentShipment = () => {
        publishShipment(shipment.id).then(() => {
            fetchSingleShipment(shipment.id).then((singleShipment) => {
                setLocalShipment({ ...singleShipment })
            })});
    }

    return (
        <div className="edit-shipment-page">
            { localShipment == null ?
                allShipments != null ?
                    <p>Shipment not found</p>
                    :
                    <p>Loading...</p>
                :
                <>
                    {/* <p>{ shipment.id }</p> */}
                    <Panel 
                        title={`Shipment ${shipmentLabel}`} 
                        backLink='/shipments'
                        actions={[
                            (((localShipment.status == 'PUBLISHED' && !isMyShipment) || (localShipment.status == 'UNPUBLISHED')) && <Button title="Save" className="secondary" onClick={() => { console.log(localShipment); updateShipment(shipment.id, localShipment, isSentShipment)}}/>),
                            (shipment.status === 'UNPUBLISHED' && <Button title="Publish" onClick={() => publishCurrentShipment()} className="primary"/>),
                            (!isClosed && !isMyShipment && localShipment.status == 'PUBLISHED' && ((isSentShipment && localShipment.sent_mass != null) || (!isSentShipment && localShipment.received_mass != null)) && <Button title="Confirm" onClick={() => confirmShipment(shipment.id)} className="primary"/>)
                        ]}
                    >
                        <p className="attribute-title">Shipment ID</p>
                        <span 
                            className="attribute-value hash"
                            style={{ marginBottom: 20 }}
                        >
                            { localShipment.id }
                        </span>

                        <div className="attributes-grid">
                            
                            <div className="attribute-column">
                                <p className="attribute-title">Sending company</p>
                                <span className="attribute-value">
                                    <TextField
                                        autoComplete="off"
                                        defaultValue={ localShipment.source_company }
                                        onChange={(e) => localShipment.source_company = e.target.value}
                                        disabled={localShipment.status != 'UNPUBLISHED'}
                                        select
                                        sx={{ width: '100%'}}
                                    >
                                        {
                                            partners.map(el => (
                                                <MenuItem key={el.id} value={el.id}>
                                                    { el.title }
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </span>
                            

                                <p className="attribute-title">Sent from</p>
                                <span className="attribute-value">
                                    <TextField
                                        autoComplete="off"
                                        defaultValue={ localShipment.source_department }
                                        onChange={(e) => localShipment.source_department = e.target.value}
                                        disabled={localShipment.status != 'UNPUBLISHED'}
                                        select
                                        sx={{ width: '100%'}}
                                    >
                                    {
                                            partners.find(el => el.id == localShipment.source_company).departments.map(dep => (
                                                <MenuItem key={dep.id} value={dep.id}>
                                                    { dep.title }
                                                </MenuItem>
                                            ))
                                    }
                                    </TextField>
                                </span>

                                <p className="attribute-title">Sending date</p>
                                <span className="attribute-value">
                                    {
                                        isSentShipment ?
                                            <DatePicker
                                                disabled={isClosed || (localShipment.status == 'PUBLISHED' && isMyShipment && isSentShipment)}
                                                defaultValue={localShipment.sending_date == null ? new Date() : new Date(localShipment.sending_date)}
                                                onChange={(value) => localShipment.sending_date = value.toISOString()}
                                            />
                                        :
                                            <p>{ localShipment.sending_date || 'Waiting for confirmation'}</p>
                                    }
                                </span>
                            

                                <p className="attribute-title">Receiving date</p>
                                <span className="attribute-value">
                                    {
                                        !isSentShipment ?
                                            <DatePicker
                                            disabled={isClosed || (localShipment.status == 'PUBLISHED' && isMyShipment && !isSentShipment)}
                                                defaultValue={localShipment.receiving_date == null ? new Date() : new Date(localShipment.receiving_date)}
                                                onChange={(value) => localShipment.receiving_date = value.toISOString()}
                                            />
                                        :
                                            <p>{ localShipment.receiving_date || 'Waiting for confirmation'}</p>
                                    }
                                </span>
                            </div>

                            <div className="attribute-column">
                                <p className="attribute-title">Receiving company</p>
                                <span className="attribute-value">
                                    <TextField
                                        autoComplete="off"
                                        defaultValue={ localShipment.target_company }
                                        onChange={(e) => localShipment.target_company = e.target.value}
                                        disabled={localShipment.status != 'UNPUBLISHED'}
                                        sx={{ width: '100%'}}
                                        select
                                    >
                                    {
                                            partners.map(el => (
                                                <MenuItem key={el.id} value={el.id}>
                                                    { el.title }
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </span>
                            

                                <p className="attribute-title">Received at</p>
                                <span className="attribute-value">
                                <TextField
                                    autoComplete="off"
                                    defaultValue={ localShipment.target_department }
                                    onChange={(e) => localShipment.target_department = e.target.value}
                                    disabled={localShipment.status != 'UNPUBLISHED'}
                                    sx={{ width: '100%'}}
                                    select
                                >
                                    {
                                            partners.find(el => el.id == localShipment.target_company).departments.map(dep => (
                                                <MenuItem key={dep.id} value={dep.id}>
                                                    { dep.title }
                                                </MenuItem>
                                            ))
                                    }
                                    </TextField>
                                </span>

                                <p className="attribute-title">Sent mass (g)</p>
                                <span className="attribute-value">
                                    {
                                        isSentShipment ?
                                            <TextField
                                                autoComplete="off"
                                                sx={{ width: '100%'}}
                                                type="number"
                                                disabled={isClosed || (localShipment.status == 'PUBLISHED' && isMyShipment && isSentShipment)}
                                                defaultValue={localShipment.sent_mass == null ? 0 : parseInt(localShipment.sent_mass)}
                                                onChange={(e) => localShipment.sent_mass = parseInt(e.target.value)}
                                            />
                                        :
                                            <p>{ localShipment.sent_mass || 'Waiting for confirmation' }</p>
                                    }
                                </span>
                            

                                <p className="attribute-title">Received mass (g)</p>
                                <span className="attribute-value">
                                    {
                                        !isSentShipment ?
                                            <TextField
                                                autoComplete="off"
                                                sx={{ width: '100%'}}
                                                type="number"
                                                disabled={isClosed || (localShipment.status == 'PUBLISHED' && isMyShipment && !isSentShipment)}
                                                defaultValue={localShipment.received_mass == null ? 0 : parseInt(localShipment.received_mass)}
                                                onChange={(e) => localShipment.received_mass = parseInt(e.target.value)}
                                            />
                                        :
                                            <p>{ localShipment.received_mass || 'Waiting for confirmation' }</p>
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='actions-bar'>
                            <div className="attribute-column">
                                <p className="attribute-title">Shipment status</p>
                                <span className="attribute-value">
                                    { localShipment.status }
                                </span>

                                { localShipment.creation_transaction_hash &&
                                    <>
                                        <p className="attribute-title">Creation TX hash</p>
                                        <span className="attribute-value hash">
                                            { localShipment.creation_transaction_hash }
                                        </span>
                                    </>
                                }
                            </div>

                        </div>
                    </Panel>

                    <div className="items-wrap">
                        <Panel title="Shipment items">
                            <PerfectScrollbar>
                                <ItemsTable 
                                    key={localShipment.items.map(item => `${item.id},${item.quantity_unit},${item.quantity_value}`).join(',')} 
                                    items={localShipment.items} editEnabled={!isClosed} onSubmit={(items) => updateShipmentItems(items)}
                                />
                            </PerfectScrollbar>
                        </Panel>
                    </div>
                </>
            }
        </div>
    )
}