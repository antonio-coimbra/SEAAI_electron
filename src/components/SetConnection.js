import "../css/SetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import { ReactComponent as Logo } from "../images/sea-ai-logo.svg";
import { ReactComponent as SearchIcon } from "../images/search.svg";
import { appStates } from "../shared/constants";

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

    if (appStates.ERROR_AUTO_CONNECTION_STATE) {
        triedAutoConnect
            ? (error = "Automatic connection failed. Please try again.")
            : (error = null);
    }
    return (
        <div className="setConnection">
            <Logo className="setConnection-logo" />
            <Title />
            <IpInput
                appState={appState}
                setTriedAutoConnect={setTriedAutoConnect}
            />
            <div className="setConnection-message">
                If you are unable to find the IP address, try to connect
                automatically to Sentry or contact Customer Service.
            </div>
            <div className="setConnection-tryAutoConnection">
                <StandardButton type="submit" onClick={autoConnect}>
                    <SearchIcon />
                    Try Automatic Connection
                </StandardButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </div>
        </div>
    );
}

export default SetConnection;
