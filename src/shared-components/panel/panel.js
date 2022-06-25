import { ChevronLeft } from "@mui/icons-material"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar";

export const Panel = ({ children, title, style=null, backLink, actions}) => {
    return (
        <div className="panel" style={{...style}}>
            <div className="panel-header">
                <span>
                    { 
                        backLink != null &&
                        <span className="back-link">
                            <Link to={backLink}><ChevronLeft/> Back</Link>  | 
                        </span>
                    }
                    { title }
                </span>
                { actions != null &&
                    <span className="panel-actions">
                        { actions }
                    </span>
                }
            </div>
            <PerfectScrollbar>
                <div className="panel-content">
                    { children }
                </div>
            </PerfectScrollbar>
        </div>
    )
}