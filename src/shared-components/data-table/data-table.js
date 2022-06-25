import { DataGrid } from '@mui/x-data-grid';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipmentContext } from '../../contexts/shipment-context';
import { Button } from '../button/button';

export const DataTable = ({ columns, rows }) => {
    const navigate = useNavigate();
    const { deleteShipment } = useContext(ShipmentContext);

    return (
        <div className="data-table">
            <DataGrid
                key={Math.random()}
                rows={rows ? rows.map(row => ({ ...row })) : []}
                columns={columns.concat({ 
                    field: 'actions', 
                    headerName: '', 
                    // flex: 1,
                    width: 200,
                    align: 'right',
                    sortable: false,
                    renderCell: (params) => (
                        <div className="action-buttons">
                            <Button className="primary" onClick={() => navigate(`/shipments/${params.row.label}`)} title="View" />
                            {
                                params.row.status === 'UNPUBLISHED' &&
                                <Button className="error" onClick={() => deleteShipment(params.row.id)} title="Delete" />
                            }
                        </div>
                    )
                })}
                
                pageSize={20}
                // getRowHeight={() => 'auto'}
                rowsPerPageOptions={[20]}
            />
        </div>
    )
}