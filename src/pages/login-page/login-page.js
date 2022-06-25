import { MenuItem, TextField } from "@mui/material";
import { createRef, useContext, useRef } from "react";
import { useNavigate, useResolvedPath } from "react-router-dom";
import { Button } from '../../shared-components/button/button';
import { ConfigContext } from '../../contexts/config-context';
import { ShipmentContext } from '../../contexts/shipment-context';
import { UserContext } from "../../contexts/user-context";

export const LoginPage = () => {
    const nodeRef = createRef();
    const usernameRef = createRef();
    const passwordRef = createRef();
    const navigate = useNavigate();

    const { updateConfig } = useContext(ConfigContext);
    const { login, availableNodes } = useContext(UserContext);


    const selectedNode = useRef(null);

    return (
        <div className="login-page">
            <div className="login-form">
                <h2>Login</h2>
                <TextField
                    inputRef={nodeRef}
                    select
                    label="Node"
                    onChange={(e) => selectedNode.current = e.target.value}
                >
                    {
                        availableNodes.map(node => (
                            <MenuItem key={`${node.nodeApi}-select`} value={node.nodeApi}>
                                { node.value }
                            </MenuItem>
                        ))
                    }
                </TextField>

                <TextField
                    inputRef={usernameRef}
                    label="Username"
                    autoComplete="off"
                />

                <TextField
                    inputRef={passwordRef}
                    label="Password"
                    autoComplete="off"
                />

                <div className="login-actions">
                    <Button 
                        className="primary" 
                        title="Login" 
                        onClick={() => login(
                            selectedNode.current, 
                            usernameRef.current.value,
                            passwordRef.current.value,
                        )}/>
                </div>
            </div>
        </div>
    )
}