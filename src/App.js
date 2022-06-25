import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';

import './App.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import ConfigContextProvider from "./contexts/config-context";
import PartnerContextProvider from "./contexts/partner-context";
import ShipmentContextProvider from "./contexts/shipment-context";
import { EditShipmentPage } from "./pages/edit-shipment-page/edit-shipment-page";
import { ShipmentsPage } from "./pages/shipments-page/shipments-page";
import { AppHeader } from "./shared-components/app-header/app-header";
import { Sidebar } from "./shared-components/sidebar/sidebar";
import { LoginPage } from "./pages/login-page/login-page";
import UserContextProvider from "./contexts/user-context";
import SocketsContextProvider from "./contexts/sockets-context";

function App() {
  return (
    <div className="App">
      <CookiesProvider>
        <UserContextProvider>
          <ToastContainer/>
          <ConfigContextProvider>
            <PartnerContextProvider>
              <ShipmentContextProvider>
                <SocketsContextProvider>
                  <AppHeader/>
                  <div className="page-wrap">
                    <Sidebar/>
                    <div className="page-content-wrap">
                      <Routes>
                        <Route path="/shipments/:shipmentLabel" element={<EditShipmentPage/>}/>
                        <Route path="/shipments" element={<ShipmentsPage/>}/>
                        {/* TODO: Redirect to login page */}
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route index element={<Navigate to="/login"/>} />
                      </Routes>
                    </div>
                  </div>
                </SocketsContextProvider>
              </ShipmentContextProvider>
            </PartnerContextProvider>
          </ConfigContextProvider>
        </UserContextProvider>
      </CookiesProvider>
    </div>
  );
}

export default App;
