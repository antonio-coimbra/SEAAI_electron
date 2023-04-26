import "../css/TitleBar.css";
import { useState, useEffect } from "react";
import logo from "../images/favicon.svg";
import { ReactComponent as Close } from "../images/iconclose.svg";
import { ReactComponent as Restore } from "../images/iconrestore.svg";
import { ReactComponent as Minimize } from "../images/iconmin.svg";
import { ReactComponent as Maximize } from "../images/iconmax.svg";
import NavLinkButton from "./NavLinkButton";

import { TITLE_BAR_HEIGHT } from "../shared/constants";

function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);
    function minimize() {
        window.api.frame.minimize();
    }
    function maxres() {
        window.api.frame.maximize();
    }
    function closeApp() {
        window.api.frame.close();
    }

    useEffect(() => {
        // Listen for the event
        window.api.getIsMaximized(setIsMaximized);
    }, [setIsMaximized]);

    return (
        <nav className="titleBar" style={{ height: TITLE_BAR_HEIGHT + "px" }}>
            <div className="titleBar-leftNav">
                <img src={logo} alt="SEA.AI Logo" />
            </div>
            <div className="titleBar-rightNav">
                <NavLinkButton
                    onClickAction={minimize}
                    specific="titleBar-rightNav-navLink-minimizeBtn"
                >
                    <Minimize />
                </NavLinkButton>
                {isMaximized && (
                    <NavLinkButton
                        onClickAction={maxres}
                        specific="titleBar-rightNav-navLink-restoreBtn"
                    >
                        <Restore />
                    </NavLinkButton>
                )}
                {!isMaximized && (
                    <NavLinkButton
                        onClickAction={maxres}
                        specific="titleBar-rightNav-navLink-maximizeBtn"
                    >
                        <Maximize />
                    </NavLinkButton>
                )}
                <NavLinkButton
                    onClickAction={closeApp}
                    specific="titleBar-rightNav-navLink-closeBtn"
                >
                    <Close />
                </NavLinkButton>
            </div>
        </nav>
    );
}

export default TitleBar;
