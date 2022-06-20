import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './App.css';
import ConfigContextProvider from "./contexts/config-context";
import PartnerContextProvider from "./contexts/partner-context";
import ShipmentContextProvider from "./contexts/shipment-context";
import { EditShipmentPage } from "./pages/edit-shipment-page/edit-shipment-page";
import { ShipmentsPage } from "./pages/shipments-page/shipments-page";
import { AppHeader } from "./shared-components/app-header/app-header";
import { Sidebar } from "./shared-components/sidebar/sidebar";

function App() {
  return (
    <div className="App">
      <ConfigContextProvider>
        <PartnerContextProvider>
          <ShipmentContextProvider>
            <AppHeader/>
            <div className="page-wrap">
              <Sidebar/>
              <div className="page-content-wrap">
                <Routes>
                  <Route path="/shipments/:shipmentLabel" element={<EditShipmentPage/>}/>
                  <Route path="/shipments" element={<ShipmentsPage/>}/>
                  {/* TODO: Redirect to login page */}
                  <Route index element={<Navigate to="/shipments"/>} />
                </Routes>
              </div>
            </div>
          </ShipmentContextProvider>
        </PartnerContextProvider>
      </ConfigContextProvider>
    </div>
  );
}

export default App;
