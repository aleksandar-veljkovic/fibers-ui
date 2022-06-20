import { Close } from "@mui/icons-material"
import { Button } from "../button/button"
export const Modal = ({ children, title, onClose, actions }) => {
    return (
        <div className="modal" onClick={() => onClose && onClose()}>
            <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">
                        { title }
                    </span>
                    <span className="modal-close" onClick={() => onClose && onClose()}>
                        <Close/>
                    </span>
                </div>
                <div className="modal-content">
                    { children }
                </div>
                <div className="modal-footer">
                    { actions }
                    <Button onClick={() => onClose && onClose()} title="Close" />
                </div>
            </div>
        </div>
    )
}