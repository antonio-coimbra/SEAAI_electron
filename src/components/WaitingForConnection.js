import "../css/WaitingForConnection.css";
import { ReactComponent as NameLogo } from "../images/namelogo.svg";
import { useEffect } from "react";
import { appStates } from "../shared/constants";

function WaitingForConnection({ appState }) {
    useEffect(() => {
        if (appState === appStates.AUTO_CONNECTION_STATE)
            // Connect automatically
            window.api.autoConnection();
    }, [appState]);

    return (
        <div className="waitingForConnection">
            <NameLogo className="waitingForConnection-nameLogo" />
        </div>
    );
}

export default WaitingForConnection;
