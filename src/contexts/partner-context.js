import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./user-context";

export const PartnerContext = createContext();

const PartnerContextProvider = ({ children }) => {
    const { user } = useContext(UserContext);

    const [partners, setPartners] = useState(null);
    const arePartnersLoaded = useRef(false);
    const isBusy = useRef(false);
    const isError = useRef(false);

    const fetchPartners = async () => {
        isBusy.current = true;

        const { nodeApi } = user;
        console.log('Fetching partners');

        try {
            const res = await axios.get(`${nodeApi}/network/partners`);
            setPartners(res.data.data);
            console.log(res.data.data);
            arePartnersLoaded.current = true;
        } catch(err) {
            console.log(err);
        } finally {
            isBusy.current = false;
        }

    }

    useEffect(() => {
        if (!isBusy.current && !arePartnersLoaded.current && !isError.current && user != null) {
            fetchPartners();   
        }
    }, [user])

    return (
        <PartnerContext.Provider value={{ partners }}>
            { children }
        </PartnerContext.Provider>
    )
}

export default PartnerContextProvider;