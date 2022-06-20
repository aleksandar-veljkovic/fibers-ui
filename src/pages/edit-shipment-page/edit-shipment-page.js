import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ConfigContext } from "../../contexts/config-context";
import { ShipmentContext } from "../../contexts/shipment-context";
import { Panel } from "../../shared-components/panel/panel";

export const EditShipmentPage = () => {
    const { allShipments } = useContext(ShipmentContext);
    let { shipmentLabel } = useParams();
    const { companyId: myCompanyId } = useContext(ConfigContext);
    
    const shipment = allShipments != null ? allShipments.find(s => s.label === shipmentLabel) : null;

    const isSentShipment = shipment != null && shipment.source_company === myCompanyId;

    return (
        <div className="edit-shipment-page">
            { shipment == null ?
                allShipments != null ?
                    <p>Shipment not found</p>
                    :
                    <p>Loading...</p>
                :
                <>
                    {/* <p>{ shipment.id }</p> */}
                    <Panel title={`Shipment ${shipmentLabel}`} backLink='/shipments'>
                        <div className="attributes-grid">
                            
                            <div className="attribute-column">
                                <p className="attribute-title">Partner</p>
                                <span className="attribute-value">
                                    { isSentShipment ? shipment.target_company_title : shipment.source_company_title }
                                </span>
                            </div>

                            <div className="attribute-column">
                                <p className="attribute-title">Partner department</p>
                                <span className="attribute-value">
                                    { isSentShipment ? shipment.target_department_title : shipment.source_department_title }
                                </span>
                            </div>

                        </div>
                        <div className="panel-attribute">
                        </div>
                        
                    </Panel>
                </>
            }
        </div>
    )
}