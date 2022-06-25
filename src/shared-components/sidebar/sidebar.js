import { Close, ImportExport, Inventory, LocalShipping, People, Settings } from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom"

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { pathname: path } = location;
    const pathBase = path.split('/')[1];

    return (
        <>
        {
            pathBase == 'login' ?
            null
            :
            (<aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-title">Menu</span>
                {/* <span className="sidebar-toggle"><Close/> Close</span> */}
            </div>
            <ul className="sidebar-items">
                <li className={`sidebar-item ${pathBase === 'shipments' && 'active'}`}>
                    <span className="sidebar-item-icon">
                        <ImportExport/>
                    </span>
                    Shipments
                </li>
                <li className="sidebar-item">
                    <span className="sidebar-item-icon">
                        <Inventory/>
                    </span>
                    Items
                </li>
                <li className="sidebar-item">
                    <span className="sidebar-item-icon">
                        <LocalShipping/>
                    </span>
                    Partners
                </li>
                <li className="sidebar-item">
                    <span className="sidebar-item-icon">
                        <Settings/>
                    </span>
                    Company Settings
                </li>
                <li className="sidebar-item">
                    <span className="sidebar-item-icon">
                        <People/>
                    </span>
                    Users
                </li>
            </ul>
        </aside>)
        }
        </>
    )
}