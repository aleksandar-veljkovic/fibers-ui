import { createContext } from "react";
import config from "../config";

export const ConfigContext = createContext();

const ConfigContextProvider = ({ children }) => {
    return (
        <ConfigContext.Provider value={{ ...config }}>
            { children }
        </ConfigContext.Provider>
    )
}

export default ConfigContextProvider;