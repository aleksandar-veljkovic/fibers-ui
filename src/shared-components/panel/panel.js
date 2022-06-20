import { ChevronLeft } from "@mui/icons-material"
import { Link } from "react-router-dom"

export const Panel = ({ children, title, style=null, backLink}) => {
    return (
        <div className="panel" style={{...style}}>
            <div className="panel-header">
                { 
                    backLink != null &&
                    <span className="back-link">
                        <Link to={backLink}><ChevronLeft/> Back</Link>  | 
                    </span>
                }
                { title }
            </div>
            <div className="panel-content">
                { children }
            </div>
        </div>
    )
}