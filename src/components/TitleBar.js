import "../css/TitleBar.css";
import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "../images/sea-ai-logo.svg";
import { ReactComponent as Close } from "../images/close.svg";
import { ReactComponent as Restore } from "../images/window-size.svg";
import { ReactComponent as Minimize } from "../images/minus.svg";
import { ReactComponent as Maximize } from "../images/full-size.svg";
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
                <Logo className="titleBar-leftNav-logo" />
            </div>
            <div className="titleBar-rightNav">
                <NavLinkButton onClickAction={minimize} specific="minimizeBtn">
                    <Minimize />
                </NavLinkButton>
                {isMaximized && (
                    <NavLinkButton onClickAction={maxres} specific="restoreBtn">
                        <Restore />
                    </NavLinkButton>
                )}
                {!isMaximized && (
                    <NavLinkButton
                        onClickAction={maxres}
                        specific="maximizeBtn"
                    >
                        <Maximize />
                    </NavLinkButton>
                )}
                <NavLinkButton onClickAction={closeApp} specific="closeBtn">
                    <Close />
                </NavLinkButton>
            </div>
        </nav>
    );
}

export default TitleBar;
