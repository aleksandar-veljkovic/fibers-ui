import { createContext, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { ShipmentContext } from "./shipment-context";
import { UserContext } from "./user-context";

export const SocketsContext = createContext();

const SocketsContextProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const { fetchShipments } = useContext(ShipmentContext);
    const socketConnection = useRef(null);
    const socketInit = useRef(false);

    useEffect(() => {
        if (user != null && socketConnection.current == null && !socketInit.current) {
            socketInit.current = true;

            console.log(`Creating connection with ${user.socketsApi}`);

            socketConnection.current = io(user.socketsApi, {
                reconnectionDelayMax: 10000,
              });

            socketConnection.current.on("connect", () => {
                console.log('Sockets connected');
            })

            socketConnection.current.on("shipments", async (data) => {
                const { message } = data;
                toast.info(message);
                fetchShipments();
            })
        }
    }, [user])

    return (
        <SocketsContext.Provider value={{ socketConnection }}>
            { children }
        </SocketsContext.Provider>
    )
}

export default SocketsContextProvider;