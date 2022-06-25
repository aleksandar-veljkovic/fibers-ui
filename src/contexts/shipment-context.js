import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { PartnerContext } from "./partner-context";
import { toast } from 'react-toastify';
import { UserContext } from "./user-context";

export const ShipmentContext = createContext();

const ShipmentContextProvider = ({ children }) => {
    
    const { user } = useContext(UserContext);

    const { partners } = useContext(PartnerContext);
    const [allShipments, setAllShipments] = useState(null);
    const [receivedShipments, setReceivedShipments] = useState(null);
    const [sentShipments, setSentShipments] = useState(null);
    const areShipmentsLoaded = useRef(false);
    const isBusy = useRef(false);
    const isError = useRef(false);
    const localPartners = useRef(null);

    const fetchSingleShipment = async (shipmentId) => {
        const { nodeApi } = user;
        const res = await axios.get(`${nodeApi}/shipments/${shipmentId}`, { params: { include_items: true } })
        return res.data.data;
    }

    const createShipment = async (shipmentData) => {
        const { nodeApi } = user;
        const toastId = toast('Creating shipment', { isLoading: true, autoClose: false });

        try {
            // TODO: Auth token
            await axios.post(`${nodeApi}/shipments`, shipmentData);
            toast.update(toastId, { isLoading: false, type: toast.TYPE.SUCCESS, render: "Shipment created"} );
            fetchShipments();
        } catch (err) {
            toast.update(toastId, { isLoading: false, type: toast.TYPE.ERROR, render: "Failed to create shipment"} );
            // TODO: Error handling
        }
    }

    const fetchShipments = async () => {
        isBusy.current = true;

        const { nodeApi, companyId } = user;

        console.log('Fetching data...');

        console.log(companyId);

        try {
            const res = await axios.get(`${nodeApi}/shipments`);
            const allPreparedShipments = [];
            // It's easier than creating pipe hell
            for (const shipment of res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) {
                const {
                    source_company: sourceCompany,
                    source_department: sourceDepartment,
                    target_company: targetCompany,
                    target_department: targetDepartment,
                } = shipment;


                const sendingPartner = localPartners.current.find(el => el.id === sourceCompany);
                console.log(sourceCompany, sendingPartner, localPartners.current);
                const sendingDepartment = sendingPartner.departments.find(el => el.id === sourceDepartment);

                const receivingPartner = localPartners.current.find(el => el.id === targetCompany);
                const receivingDepartment = receivingPartner.departments.find(el => el.id === targetDepartment);

                shipment.source_company_title = sendingPartner.title;
                shipment.source_department_title = sendingDepartment.title;

                shipment.target_company_title = receivingPartner.title;
                shipment.target_department_title = receivingDepartment.title;

                allPreparedShipments.push(shipment);
            }

            const received = allPreparedShipments.filter(shipment => shipment.target_company === companyId);
            const sent = allPreparedShipments.filter(shipment => shipment.source_company === companyId);

            setReceivedShipments(received);
            setSentShipments(sent);
            setAllShipments(allPreparedShipments);
            areShipmentsLoaded.current = true;
        } catch(err) {
            console.log(err);
            isError.current = true;
            // TODO: Error handling
        } finally {
            isBusy.current = false;
        }
    }

    const updateItems = async (shipmentId, items) => {
        const { nodeApi } = user;
        try {
            await axios.put(`${nodeApi}/shipments/${shipmentId}`, { items });
            toast.success('Shipment items updated');
        } catch(err) {
            // TODO: Error handling
            toast.error('Failed to update shipment items');
        }
    }

    const updateShipment = async (shipmentId, data, isSentShipment) => {
        const { nodeApi } = user;
        try {
            const preparedData = {
                source_company: data.source_company,
                source_department: data.source_department,
                target_company: data.target_company,
                target_department: data.target_department,
            };
            
            if (isSentShipment) {
                preparedData.sending_date = data.sending_date;
                preparedData.sent_mass = data.sent_mass;
            } else {
                preparedData.receiving_date = data.receiving_date;
                preparedData.received_mass = data.received_mass;
            }

            await axios.put(`${nodeApi}/shipments/${shipmentId}`, preparedData);
            toast.success('Shipment updated');
            fetchShipments();
        } catch(err) {
            // TODO: Error handling
            toast.error('Failed to update shipment');
        }
    }

    const publishShipment = async (shipmentId) => {
        const toastId = toast("Publishing shipment", { isLoading: true, autoClose: false });
        const { nodeApi } = user;
        try {
            await axios.post(`${nodeApi}/blockchain/submit/${shipmentId}`);
            toast.update(toastId, { isLoading: false, type: toast.TYPE.SUCCESS, render: 'Shipment published',  autoClose: 2000 });
            fetchShipments();
        } catch (err) {
            toast.update(toastId, { isLoading: false, type: toast.TYPE.ERROR, render: 'Failed to publish',  autoClose: 2000 });
        }
    }

    const confirmShipment = async (shipmentId) => {
        const toastId = toast("Confirming shipment", { isLoading: true, autoClose: false });
        const { nodeApi } = user;
        try {
            await axios.post(`${nodeApi}/blockchain/confirm/${shipmentId}`);
            toast.update(toastId, { isLoading: false, type: toast.TYPE.SUCCESS, render: 'Shipment confirmed',  autoClose: 2000 });
            fetchShipments();
        } catch (err) {
            toast.update(toastId, { isLoading: false, type: toast.TYPE.ERROR, render: 'Failed to confirm',  autoClose: 2000 });
        }
    }

    const deleteShipment = async (shipmentId) => {
        const res = window.confirm('Are you sure you want to delete this shipment?');
        if (!res) { return }

        const toastId = toast("Deleting shipment", { isLoading: true, autoClose: false });
        const { nodeApi } = user;
        try {
            await axios.delete(`${nodeApi}/shipments/${shipmentId}`);
            toast.update(toastId, { isLoading: false, type: toast.TYPE.SUCCESS, render: 'Shipment deleted',  autoClose: 2000 });
            fetchShipments();
        } catch (err) {
            console.log(err);
            toast.update(toastId, { isLoading: false, type: toast.TYPE.ERROR, render: 'Failed to delete',  autoClose: 2000 });
        }
    }

    useEffect(() => {
        if (!areShipmentsLoaded.current && !isBusy.current && !isError.current && partners != null && user != null) {
            localPartners.current = partners;
            fetchShipments();
        }
    }, [partners, user]);

    return (
        <ShipmentContext.Provider value={{ 
                isBusy, 
                areShipmentsLoaded, 
                receivedShipments, 
                sentShipments, 
                allShipments, 
                isBusy: isBusy.current,
                fetchShipments,
                createShipment,
                updateItems,
                fetchSingleShipment,
                publishShipment,
                updateShipment,
                confirmShipment,
                deleteShipment,
            }}>
            { children }
        </ShipmentContext.Provider>
    )
}

export default ShipmentContextProvider;