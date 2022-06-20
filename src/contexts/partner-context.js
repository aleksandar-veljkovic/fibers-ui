import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ConfigContext } from "./config-context";

export const PartnerContext = createContext();

const PartnerContextProvider = ({ children }) => {
    const { nodeApi } = useContext(ConfigContext);

    const [partners, setPartners] = useState(null);
    const arePartnersLoaded = useRef(false);
    const isBusy = useRef(false);
    const isError = useRef(false);

    const fetchPartners = async () => {
        isBusy.current = true;

        try {
            const res = await axios.get(`${nodeApi}/network/partners`);
            setPartners(res.data.data);
            arePartnersLoaded.current = true;
        } catch(err) {

        } finally {
            isBusy.current = false;
        }

    }

    useEffect(() => {
        if (!isBusy.current && !arePartnersLoaded.current && !isError.current) {
            fetchPartners();   
        }
    })

    return (
        <PartnerContext.Provider value={{ partners }}>
            { children }
        </PartnerContext.Provider>
    )
}

export default PartnerContextProvider;