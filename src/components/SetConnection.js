import "../css/SetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
import StandardButton from "./StandardButton";
import { ReactComponent as Logo } from "../images/sea-ai-logo.svg";
import { appStates } from "../shared/constants";

function SetConnection({
    setAppState,
    appState,
    setTriedAutoConnect,
    startInput,
    setStartInput
}) {
    function autoConnect() {
        setTriedAutoConnect(true);
        setAppState(appStates.AUTO_CONNECTION_STATE);
    }

    function insertIPAddress() {
        setAppState(appStates.SELECT_IP_STATE);
    }

    return (
        <div className="setConnection">
            <div className="setConnection-header">
                <Logo className="setConnection-header-logo" />
                <Title
                    subtitle={
                        appState === appStates.SELECT_IP_STATE
                            ? "Insert your Sentry's IP address."
                            : "We were unable to connect to Sentry, please try again."
                    }
                />
            </div>
            {appState !== appStates.RETRY_AUTO_CONNECTION_STATE && (
                <IpInput
                    appState={appState}
                    setAppState={setAppState}
                    setTriedAutoConnect={setTriedAutoConnect}
                    startInput={startInput}
                    setStartInput={setStartInput}
                />
            )}
            {appState === appStates.RETRY_AUTO_CONNECTION_STATE && (
                <div className="setConnection-tryAutoConnection">
                    <StandardButton onClick={autoConnect}>
                        Try Automatic Connection
                    </StandardButton>
                    <div className="setConnection-tryAutoConnection-insertIP">
                        <div>Unable to connect?</div>
                        <div
                            className="setConnection-tryAutoConnection-insertIP-link"
                            onClick={insertIPAddress}
                        >
                            Insert IP Adress
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetConnection;
