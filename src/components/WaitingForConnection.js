import "../css/WaitingForConnection.css";
import { ReactComponent as Logo } from "../images/namelogo.svg";
import { useEffect } from "react";
import { appStates } from "../shared/constants";

function WaitingForConnection({ appState }) {
    useEffect(() => {
        // Connect automatically
        if (appState === appStates.AUTO_CONNECTION_STATE)
            window.api.autoConnection();
    }, [appState]);

    return (
        <div className="waitingForConnection">
            <Logo />
        </div>
    );
}

export default WaitingForConnection;
