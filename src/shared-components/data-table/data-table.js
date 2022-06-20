import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button/button';

export const DataTable = ({ columns, rows }) => {
    const navigate = useNavigate();

    return (
        <div className="data-table">
            <DataGrid
                key={Math.random()}
                rows={rows ? rows.map(row => ({ ...row })) : []}
                columns={columns.concat({ 
                    field: 'actions', 
                    headerName: '', 
                    // flex: 1,
                    width: 100,
                    align: 'right',
                    sortable: false,
                    renderCell: (params) => (
                        <div className="action-buttons">
                            <Button className="primary" onClick={() => navigate(`/shipments/${params.row.label}`)} title="View" />
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