import "../css/SetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
import StandardButton from "./StandardButton";
import logo from "../images/logo-large.svg";
import search from "../images/search.svg";
// import { useEffect, useState } from "react";
import { appStates } from "../shared/constants";

function SetConnection({
    setAppState,
    appState,
    setTriedAutoConnect,
    triedAutoConnect,
}) {
    function autoConnect() {
        console.log("user pressed auto connect");
        setTriedAutoConnect(true);
        setAppState(appStates.AUTO_CONNECTION_STATE);
    }

    console.log("auto connect error = " + triedAutoConnect);
    return (
        <div className="setConnection">
            <img src={logo} alt="logo" className="setConnection-logo" />
            <Title>Connect to Sentry</Title>
            <IpInput
                appState={appState}
                triedAutoConnect={triedAutoConnect}
                setTriedAutoConnect={setTriedAutoConnect}
            />
            <div className="setConnection-message">
                If you are unable to find the IP address, try to connect
                automatically to Sentry or contact Customer Service.
            </div>
            <StandardButton type="submit" icon={search} onClick={autoConnect}>
                Try Automatic Connection
            </StandardButton>
        </div>
    );
}

export default SetConnection;
