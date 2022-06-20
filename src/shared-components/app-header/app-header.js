import logo from '../../assets/images/logo.svg';

export const AppHeader = () => {
    return (
        <div className="app-header">
            <div className="header-logo">
                <img src={logo} alt="logo"/>
            </div>
        </div>
    )
}