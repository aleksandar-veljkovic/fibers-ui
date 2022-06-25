import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

export const UserContext = createContext();


// TODO: Fetch the list from the config
const nodes = [{
        value: "Node 1",
        nodeApi: 'http://localhost:9229',
        socketsApi: 'http://localhost:8228',
        companyId: '1b58a94ce84bf83016e777c77e74c0ca508d832cb82d2f4ccb7946a503ce72cb',
        departmentId: '7f386528170deda53d8e5b18efdfb2f5ece6c7a6272acf4183b2c543510de89c'
    },{
        value: "Node 2",
        nodeApi: 'http://localhost:9339',
        socketsApi: 'http://localhost:8338',
        companyId: '3a8e82a3b412ece07c7c4cd8d77281e099e7036af7ed97bcaa96dc1fb1ce991a',
        departmentId: 'cbdefe62dae9d7109e25d52b4920ec9cf9b3519b163301a9d51d8d6f21903774',
    }
];

const UserContextProvider = ({children}) => {
    const [cookies, setCookie] = useCookies(['name']);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user == null) {
            if (cookies.user != null) {
                setUser(cookies.user);
                // navigate('/shipments');
            }
        }
    }, []);

    const login = (nodeApi, username, password) => {
        // TODO: OAuth2.0
        const selectedNode = nodes.find(node => node.nodeApi === nodeApi);
        setUser(selectedNode);
        setCookie('user', selectedNode);
        navigate('/shipments');
    }

    const logout = () => {
        setUser(null);
        setCookie('user', null);
    }

    return (
        <UserContext.Provider value={{ availableNodes: nodes, user, login, logout }}>
            { children }
        </UserContext.Provider>
    )
}

export default UserContextProvider;