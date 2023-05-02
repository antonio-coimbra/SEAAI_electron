import "../css/MacTitleBar.css";
import { ReactComponent as Logo } from "../images/favicon.svg";
// import MacNavLinkButton from "./MacNavLinkButton";

import { MAC_TITLE_BAR_HEIGHT } from "../shared/constants";

function MacTitleBar() {
    // function minimize() {
    //     window.api.frame.minimize();
    // }
    // function maxres() {
    //     window.api.frame.maximize();
    // }
    // function close() {
    //     window.api.frame.close();
    // }

    return (
        <nav
            className="macTitleBar"
            style={{ height: MAC_TITLE_BAR_HEIGHT + "px" }}
        >
            {/* <div className="macTitleBar-leftNav">
                <MacNavLinkButton onClickAction={close} specific="closeBtn" />
                <MacNavLinkButton onClickAction={minimize} specific="minBtn" />
                <MacNavLinkButton onClickAction={maxres} specific="maxBtn" />
            </div> */}
            <div className="macTitleBar-rightNav">
                <Logo className="macTitleBar-rightNav-logo" />
            </div>
        </nav>
    );
}

export default MacTitleBar;
