import "../css/TitleBar.css";
import logo from "../images/favicon.png";
import NavLinkButton from "./NavLinkButton";

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
        <nav className="titleBar">
            <div className="titleBar-leftNav">
                <img src={logo} alt="SEA.AI Logo" />
                <div className="titleBar-leftNav-title">SEA.AI Sentry</div>
            </div>
            <div className="titleBar-rightNav">
                <NavLinkButton onClickAction={minimize}>&minus;</NavLinkButton>
                <NavLinkButton onClickAction={maximize}>&#x25A2;</NavLinkButton>
                <NavLinkButton onClickAction={closeApp}>&#10006;</NavLinkButton>
            </div>
        </nav>
    );
}

export default TitleBar;
