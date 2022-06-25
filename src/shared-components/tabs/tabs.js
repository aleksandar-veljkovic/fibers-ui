import { useRef, useState } from "react";

export const Tab = ({ children }) => {
    return (
        <div className="tab">
            { children }
        </div>
    )
}

export const Tabs = ({ children }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const childrenArray = Array.isArray(children) ? children : [children];

    return (
        <div className="tabs" key={Math.random()}>
            <div className="tabs-header">
                <div className="tab-items">
                    { childrenArray.map((c, index) => (
                        <span 
                            key={`tab-item-${index}`}
                            className={`tab-item ${index === selectedTabIndex ? 'selected' : ''}`} 
                            onClick={() => setSelectedTabIndex(index)}
                        >
                            { c.props.icon } { c.props.title }
                        </span>
                    ))}
                </div>
                { childrenArray[selectedTabIndex].props.actions && <div className="actions">
                    { 
                        childrenArray[selectedTabIndex].props.actions
                    }
                    </div>
                }
            </div>
            <div className="tabs-content">
                { childrenArray[selectedTabIndex].props.children }
            </div>
        </div>
    )
}