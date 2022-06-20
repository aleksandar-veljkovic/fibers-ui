import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { PartnerContext } from "./partner-context";
import { ConfigContext } from "./config-context";

export const ShipmentContext = createContext();

const ShipmentContextProvider = ({ children }) => {
    
    const { companyId: myCompanyId, nodeApi } = useContext(ConfigContext);

    const { partners } = useContext(PartnerContext);
    const [allShipments, setAllShipments] = useState(null);
    const [receivedShipments, setReceivedShipments] = useState(null);
    const [sentShipments, setSentShipments] = useState(null);
    const areShipmentsLoaded = useRef(false);
    const isBusy = useRef(false);
    const isError = useRef(false);

    const fetchShipments = async () => {
        isBusy.current = true;
        console.log('Fetching data...');

        try {
            const res = await axios.get(`${nodeApi}/shipments`);
            const allPreparedShipments = [];
            // It's easier than creating pipe hell
            for (const shipment of res.data.data) {
                const {
                    source_company: sourceCompany,
                    source_department: sourceDepartment,
                    target_company: targetCompany,
                    target_department: targetDepartment,
                } = shipment;


                const sendingPartner = partners.find(el => el.id === sourceCompany);
                console.log(sourceCompany, sendingPartner, partners);
                const sendingDepartment = sendingPartner.departments.find(el => el.id === sourceDepartment);

                const receivingPartner = partners.find(el => el.id === targetCompany);
                const receivingDepartment = receivingPartner.departments.find(el => el.id === targetDepartment);

                shipment.source_company_title = sendingPartner.title;
                shipment.source_department_title = sendingDepartment.title;

                shipment.target_company_title = receivingPartner.title;
                shipment.target_department_title = receivingDepartment.title;

                allPreparedShipments.push(shipment);
            }

            const received = allPreparedShipments.filter(shipment => shipment.target_company === myCompanyId);
            const sent = allPreparedShipments.filter(shipment => shipment.source_company === myCompanyId);

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

    useEffect(() => {
        if (!areShipmentsLoaded.current && !isBusy.current && !isError.current && partners != null) {
            fetchShipments();
        }
    }, [partners]);

    return (
        <ShipmentContext.Provider value={{ isBusy, areShipmentsLoaded, receivedShipments, sentShipments, allShipments, isBusy: isBusy.current }}>
            { children }
        </ShipmentContext.Provider>
    )
}

export default ShipmentContextProvider;