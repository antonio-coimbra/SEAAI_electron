import "../css/HelpMenu.css";
import { useRef, useState, useEffect } from "react";
import { ReactComponent as ChevronUp } from "../images/chevron-up.svg";
import { ReactComponent as ChevronDown } from "../images/chevron-down.svg";

function HelpMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(64);
    const ref = useRef(null);

    function helpMenu() {
        setIsOpen(!isOpen);
    }

    function getSize() {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }

    useEffect(() => getSize());

    return (
        <div
            className={"helpMenu"}
            onClick={helpMenu}
            style={{ bottom: isOpen ? `${64}px` : `${-height + 64}px` }}
        >
            <div className="helpMenu-header">
                Help & Support{isOpen ? <ChevronDown /> : <ChevronUp />}
            </div>
            <div className="helpMenu-content" ref={ref}>
                <div className="helpMenu-content-problems">
                    <p>If there's problems with the connection:</p>
                    <ul>
                        <li>Make sure Sentry is turned on.</li>
                        <li>Check if you are on the same network as Sentry</li>
                    </ul>
                </div>
                <div className="helpMenu-content-service">
                    <p>
                        For more help with this matter, contact SEA.AI Service:
                    </p>
                    <div className="helpMenu-content-service-contacts">
                        <div>
                            <p>Phone:</p>
                            <p className="helpMenu-content-service-contacts-item">
                                +33 699 72 62 41
                            </p>
                        </div>
                        <div>
                            <p>Email:</p>
                            <p className="helpMenu-content-service-contacts-item">
                                service@sea.ai
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpMenu;