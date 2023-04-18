import "../css/AutoConnection.css";
import Title from "./Title";
// import StandardButton from "./StandardButton";

import { useEffect } from "react";

function AutoConnection({ setAppState }) {
    // function goToSetConnection() {
    //     setAppState("select-ip");
    //     // TODO: this should cancel the auto connection process
    // }

    useEffect(() => {
        // Connect automatically
        window.api.autoConnection();
    }, []);

    return (
        <div className="autoConnection">
            <Title>SEA.AI SENTRY</Title>
            <div className="autoConnection-message">
                Connecting to SENTRY unit...
            </div>
            {/* <StandardButton
                className="autoConnection-goToSetConnectionButton"
                onClick={goToSetConnection}
            >
                CONNECT MANUALLY
            </StandardButton> */}
        </div>
    );
}

export default AutoConnection;
