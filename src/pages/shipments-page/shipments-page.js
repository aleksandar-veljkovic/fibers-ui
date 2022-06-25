import { createRef, useContext, useRef, useState } from "react"
import { FlightLand, FlightTakeoff } from "@mui/icons-material"
import { MenuItem, Tab, TextField } from "@mui/material"
import { Button } from "../../shared-components/button/button"
import { DataTable } from "../../shared-components/data-table/data-table"
import { Modal } from "../../shared-components/modal/modal"
import { Panel } from "../../shared-components/panel/panel"
import { Tabs } from "../../shared-components/tabs/tabs"
import { DatePicker } from "../../shared-components/date-picker/date-picker";
import { ShipmentContext } from "../../contexts/shipment-context"
import { PartnerContext } from "../../contexts/partner-context"
import { sha3_256 } from 'js-sha3';
import { UserContext } from "../../contexts/user-context"

export const ShipmentsPage = () => {
    const { partners } = useContext(PartnerContext);
    const { user } = useContext(UserContext);
    const { sentShipments, receivedShipments, createShipment, allShipments } = useContext(ShipmentContext);
    const [isRegisterSentVisible, setIsRegisterSentVisible] = useState(false);
    const [isRegisterReceivedVisible, setIsRegisterReceivedVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null)

    let companyId, departmentId;

    if (user != null) {
        companyId = user.companyId;
        departmentId = user.departmentId;
    }
    
    const receivedShipmentRefs = useRef({
        labelRef: createRef(),
        sendingCompanyRef: createRef(),
        sendingDepartmentRef: createRef(),
        receivingDateRef: createRef(),
        shipmentMassRef: createRef(),
    });

    const sentShipmentRefs = useRef({
        labelRef: createRef(),
        receivingCompanyRef: createRef(),
        receivingDepartmentRef: createRef(),
        sendingDateRef: createRef(),
        shipmentMassRef: createRef(),
    });

    const createReceivedShipment = () => {
        const label = receivedShipmentRefs.current.labelRef.current.value;
        const sourceCompany = receivedShipmentRefs.current.sendingCompanyRef.current.value;
        const targetCompany = companyId;

        const sourceDepartment = receivedShipmentRefs.current.sendingDepartmentRef.current.value;
        const targetDepartment = departmentId;

        const receivingDate = receivedShipmentRefs.current.receivingDateRef.current.value;
        const receivedMass = receivedShipmentRefs.current.shipmentMassRef.current.value;

        const shipmentObj = {
            label,
            source_company: sourceCompany,
            source_department: sourceDepartment,
            target_company: targetCompany,
            target_department: targetDepartment,
            receiving_date: new Date(receivingDate).toISOString(),
            received_mass: parseInt(receivedMass),
            status: 'UNPUBLISHED',
        };

        createShipment(shipmentObj);
        setIsRegisterReceivedVisible(false);
    }

    const createSentShipment = () => {
        const label = sentShipmentRefs.current.labelRef.current.value;
        const targetCompany = sentShipmentRefs.current.receivingCompanyRef.current.value;
        const sourceCompany = companyId;

        const targetDepartment = sentShipmentRefs.current.receivingDepartmentRef.current.value;
        const sourceDepartment = departmentId;

        const sendingDate = sentShipmentRefs.current.sendingDateRef.current.value;
        const sentMass = sentShipmentRefs.current.shipmentMassRef.current.value;

        const shipmentObj = {
            label,
            source_company: sourceCompany,
            source_department: sourceDepartment,
            target_company: targetCompany,
            target_department: targetDepartment,
            sending_date: new Date(sendingDate).toISOString(),
            sent_mass: parseInt(sentMass),
            status: 'UNPUBLISHED',
        };

        createShipment(shipmentObj);
        setIsRegisterSentVisible(false);
    }

    return (
        <div className="shipments-page">
            <Panel title="Shipments" style={{ height: '100%'}}>
                <Tabs key="shipments">
                    <Tab
                        key={sha3_256(JSON.stringify(receivedShipments))}     
                        icon={<FlightLand/>} title="Received shipments" actions={
                            <div className="tab-actions">
                                <Button 
                                    className="primary" 
                                    title="+ Register Received Shipment" 
                                    onClick={() => setIsRegisterReceivedVisible(true)}
                                />
                            </div>
                        }>
                        <DataTable
                            key={'items-' + sha3_256(JSON.stringify(receivedShipments))}
                            columns={[
                                { field: 'source_company_title', headerName: 'From partner', flex: 1 },
                                { field: 'label', headerName: 'Shipment Label', flex: 1},
                                { field: 'sending_date', headerName: 'Sending Date', flex: 1},
                                { field: 'sent_mass', headerName: 'Sent Mass', flex: 1},
                                { field: 'status', headerName: 'Status', flex: 1},
                            ]}
                            rows={receivedShipments}
                        />
                    </Tab>
                    <Tab 
                        key={sha3_256(JSON.stringify(sentShipments))}
                        icon={<FlightTakeoff/>} title="Sent shipments" actions={
                        <div className="tab-actions">
                        <Button className="primary" title="+ Register Sent Shipment" onClick={() => setIsRegisterSentVisible(true)}/>
                    </div>
                    }>
                    <DataTable
                            key={'items-' + sha3_256(JSON.stringify(sentShipments))}
                            columns={[
                                { field: 'target_company_title', headerName: 'To partner', flex: 1 },
                                { field: 'label', headerName: 'Shipment Label', flex: 1},
                                { field: 'sending_date', headerName: 'Sending Date', flex: 1},
                                { field: 'sent_mass', headerName: 'Sent Mass', flex: 1},
                                { field: 'status', headerName: 'Status', flex: 1},
                            ]}
                            rows={sentShipments}
                        />
                    </Tab>
                </Tabs>
            </Panel>
            
            { isRegisterSentVisible &&
                <Modal 
                    title="Register sent shipment" 
                    onClose={() => setIsRegisterSentVisible(false)}
                    actions={[<Button title="Register Shipment" className="primary" onClick={() => createSentShipment()}/>]}
                >
                    <div className="create-shipment-form">
                        <p>Please fill in the shipment details</p>
                        <TextField
                            autoComplete="off"
                            required
                            label="Shipment label"
                            sx={{ width: 300 }}
                            inputRef={sentShipmentRefs.current.labelRef}
                        />

                        <TextField
                            autoComplete="off"
                            required
                            label="Receiving company"
                            select
                            sx={{ width: 300 }}
                            inputRef={sentShipmentRefs.current.receivingCompanyRef}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                            {
                                partners.map(p => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.title}
                                </MenuItem>
                                ))
                            }
                        </TextField>

                        <TextField
                            autoComplete="off"
                            required
                            label="Receiving department"
                            select
                            sx={{ width: 300 }}
                            disabled={selectedCompany == null}
                            inputRef={sentShipmentRefs.current.receivingDepartmentRef}
                        >
                        {
                            selectedCompany != null && partners.find(el => el.id === selectedCompany).departments.map(d => (
                                <MenuItem key={d.id} value={d.id}>
                                {d.title}
                            </MenuItem>
                            ))
                        }
                        </TextField>

                        <DatePicker
                            required
                            onChange={(selectedDate) => console.log(selectedDate)}
                            label="Sending date"
                            sx={{ width: 300 }}
                            inputRef={sentShipmentRefs.current.sendingDateRef}
                        />

                        <TextField
                            autoComplete="off"
                            required
                            type="number"
                            label="Shipment mass (g)"
                            sx={{ width: 200 }}
                            inputRef={sentShipmentRefs.current.shipmentMassRef}
                        />
                    </div>
                </Modal>
            }

            { isRegisterReceivedVisible &&
                <Modal 
                    title="Register received shipment" 
                    onClose={() => setIsRegisterReceivedVisible(false)}
                    actions={[<Button title="Register Shipment" className="primary" onClick={() => createReceivedShipment()}/>]}
                >
                    <div className="create-shipment-form">
                        <p>Please fill in the shipment details</p>
                        <TextField
                            autoComplete="off"
                            required
                            label="Shipment label"
                            sx={{ width: 300 }}
                            inputRef={receivedShipmentRefs.current.labelRef}
                        />

                        <TextField
                            autoComplete="off"
                            required
                            label="Sending company"
                            select
                            sx={{ width: 300 }}
                            inputRef={receivedShipmentRefs.current.sendingCompanyRef}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                            {
                                partners.map(p => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.title}
                                </MenuItem>
                                ))
                            }
                        </TextField>

                        <TextField
                            autoComplete="off"
                            required
                            label="Sending department"
                            select
                            sx={{ width: 300 }}
                            disabled={selectedCompany == null}
                            inputRef={receivedShipmentRefs.current.sendingDepartmentRef}
                        >
                            {
                                selectedCompany != null && partners.find(el => el.id === selectedCompany).departments.map(d => (
                                    <MenuItem key={d.id} value={d.id}>
                                    {d.title}
                                </MenuItem>
                                ))
                            }
                        </TextField>

                        <DatePicker
                            required
                            onChange={(selectedDate) => console.log(selectedDate)}
                            label="Receiving date"
                            sx={{ width: 300 }}
                            inputRef={receivedShipmentRefs.current.receivingDateRef}
                        />

                        <TextField
                            autoComplete="off"
                            required
                            type="number"
                            label="Shipment mass (g)"
                            sx={{ width: 200 }}
                            inputRef={receivedShipmentRefs.current.shipmentMassRef}
                        />
                    </div>
                </Modal>
            }
        </div>
    )
}