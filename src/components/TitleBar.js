import "../css/TitleBar.css";
import logo from "../images/favicon.svg";
import { ReactComponent as Close } from "../images/iconclose.svg";
import { ReactComponent as Restore } from "../images/iconrestore.svg";
import { ReactComponent as Minimize } from "../images/iconmin.svg";
// import max from "../images/iconmax.svg";
import NavLinkButton from "./NavLinkButton";

import { TITLE_BAR_HEIGHT } from "../shared/constants";

function TitleBar() {
    function minimize() {
        window.api.frame.minimize();
    }

    function maximize() {
        window.api.frame.maximize();
    }
    function closeApp() {
        window.api.frame.close();
    }
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
                <NavLinkButton
                    onClickAction={maximize}
                    specific="titleBar-rightNav-navLink-restoreBtn"
                >
                    <Restore />
                </NavLinkButton>
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
