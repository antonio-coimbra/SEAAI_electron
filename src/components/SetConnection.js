import "../css/SetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import { ReactComponent as Logo } from "../images/sea-ai-logo.svg";
import { ReactComponent as SearchIcon } from "../images/search.svg";
import { appStates } from "../shared/constants";
import HelpMenu from "../components/HelpMenu";

let error = null;

function SetConnection({
    setAppState,
    appState,
    setTriedAutoConnect,
    triedAutoConnect,
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
            {appState === appStates.SELECT_IP_STATE && (
                <IpInput
                    appState={appState}
                    setAppState={setAppState}
                    setTriedAutoConnect={setTriedAutoConnect}
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
                            className="setConnection-tryAutoConnection-insertIP-button"
                            onClick={insertIPAddress}
                        >
                            Insert IP Adress
                        </div>
                    </div>
                </div>
            )}
            {/* <HelpMenu className="setConnection-helpMenu" /> */}
        </div>
    );
}

export default SetConnection;
