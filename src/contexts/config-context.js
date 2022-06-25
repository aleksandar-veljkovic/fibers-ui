import { createContext, useState } from "react";
import config from "../config";

export const ConfigContext = createContext();

const ConfigContextProvider = ({ children }) => {
    const [localConfig, setLocalConfig] = useState(config);

    const updateConfig = (obj) => {
        setLocalConfig({ ...localConfig, ...obj });
    }

    return (
        <ConfigContext.Provider value={{ ...localConfig, updateConfig }}>
            { children }
        </ConfigContext.Provider>
    )
}

export default ConfigContextProvider;