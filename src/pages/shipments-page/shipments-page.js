import { useContext, useState } from "react"
import { FlightLand, FlightTakeoff } from "@mui/icons-material"
import { MenuItem, Tab, TextField } from "@mui/material"
import { Button } from "../../shared-components/button/button"
import { DataTable } from "../../shared-components/data-table/data-table"
import { Modal } from "../../shared-components/modal/modal"
import { Panel } from "../../shared-components/panel/panel"
import { Tabs } from "../../shared-components/tabs/tabs"
import { DatePicker } from "../../shared-components/date-picker/date-picker";
import { ShipmentContext } from "../../contexts/shipment-context"

export const ShipmentsPage = () => {
    const { sentShipments, receivedShipments } = useContext(ShipmentContext);
    const [isRegisterSentVisible, setIsRegisterSentVisible] = useState(false);
    const [isRegisterReceivedVisible, setIsRegisterReceivedVisible] = useState(false);

    return (
        <div className="shipments-page">
            <Panel title="Shipments" style={{ height: '100%'}}>
                <Tabs key={Math.random()}>
                    <Tab icon={<FlightLand/>} title="Received shipments" actions={
                            <div className="tab-actions">
                                <Button 
                                    className="primary" 
                                    title="+ Register Received Shipment" 
                                    onClick={() => setIsRegisterReceivedVisible(true)}
                                />
                            </div>
                        }>
                        <DataTable
                            key={Math.random()}
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
                        icon={<FlightTakeoff/>} title="Sent shipments" actions={
                        <div className="tab-actions">
                        <Button className="primary" title="+ Register Sent Shipment" onClick={() => setIsRegisterSentVisible(true)}/>
                    </div>
                    }>
                    <DataTable
                            key={Math.random()}
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
                    actions={[<Button title="Register Shipment" className="primary" onClick={() => console.log("Register sent")}/>]}
                >
                    <div className="create-shipment-form">
                        <p>Please fill in the shipment details</p>
                        <TextField
                            required
                            label="Shipment label"
                            sx={{ width: 300 }}
                        />

                        <TextField
                            required
                            label="Receiving company"
                            select
                            sx={{ width: 300 }}
                        >
                            <MenuItem key='c1' value='Maxi'>
                                Maxi
                            </MenuItem>

                            <MenuItem key='c2' value='Idea'>
                                Idea
                            </MenuItem>
                        </TextField>

                        <TextField
                            required
                            label="Receiving department"
                            select
                            sx={{ width: 300 }}
                        >
                            <MenuItem key='d1' value='Maxi'>
                                Maxi Gospodar Jovanova
                            </MenuItem>

                            <MenuItem key='d2' value='Idea'>
                                Idea London
                            </MenuItem>
                        </TextField>

                        <DatePicker
                            required
                            onChange={(selectedDate) => console.log(selectedDate)}
                            label="Sending date"
                            sx={{ width: 300 }}
                        />

                        <TextField
                            required
                            type="number"
                            label="Shipment mass (g)"
                            sx={{ width: 200 }}
                        />
                    </div>
                </Modal>
            }

            { isRegisterReceivedVisible &&
                <Modal 
                    title="Register received shipment" 
                    onClose={() => setIsRegisterReceivedVisible(false)}
                    actions={[<Button title="Register Shipment" className="primary" onClick={() => console.log("Register received")}/>]}
                >
                    <div className="create-shipment-form">
                        <p>Please fill in the shipment details</p>
                        <TextField
                            required
                            label="Shipment label"
                            sx={{ width: 300 }}
                        />

                        <TextField
                            required
                            label="Sending company"
                            select
                            sx={{ width: 300 }}
                        >
                            <MenuItem key='c1' value='Maxi'>
                                Maxi
                            </MenuItem>

                            <MenuItem key='c2' value='Idea'>
                                Idea
                            </MenuItem>
                        </TextField>

                        <TextField
                            required
                            label="Sending department"
                            select
                            sx={{ width: 300 }}
                        >
                            <MenuItem key='d1' value='Maxi'>
                                Maxi Gospodar Jovanova
                            </MenuItem>

                            <MenuItem key='d2' value='Idea'>
                                Idea London
                            </MenuItem>
                        </TextField>

                        <DatePicker
                            required
                            onChange={(selectedDate) => console.log(selectedDate)}
                            label="Receiving date"
                            sx={{ width: 300 }}
                        />

                        <TextField
                            required
                            type="number"
                            label="Shipment mass (g)"
                            sx={{ width: 200 }}
                        />
                    </div>
                </Modal>
            }
        </div>
    )
}