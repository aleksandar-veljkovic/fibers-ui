import { useContext } from 'react';
import logo from '../../assets/images/logo.svg';
import { ConfigContext } from '../../contexts/config-context';

export const AppHeader = () => {
    const { username } = useContext(ConfigContext);
    return (
        <div className="app-header">
            <div className="header-logo">
                <img src={logo} alt="logo"/>
            </div>
            <p>{username}</p>
        </div>
    )
}