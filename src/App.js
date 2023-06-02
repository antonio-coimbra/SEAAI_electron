import { useEffect, useState } from "react";
import { appStates } from "./shared/constants";
import TitleBar from "./components/TitleBar";
import MacTitleBar from "./components/MacTitleBar";
import SetConnection from "./components/SetConnection";
import WaitingForConnection from "./components/WaitingForConnection";
import HelpMenu from "./components/HelpMenu";
import "./css/App.css";

function App() {
    const [appState, setAppState] = useState(appStates.AUTO_CONNECTION_STATE);
    const [triedAutoConnect, setTriedAutoConnect] = useState(false);
    const [isMacOs, setIsMacOS] = useState(null);

    useEffect(() => {
        // Listen for the event
        window.api.getAppState(setAppState);
        console.log(appState);
    }, []);

    useEffect(() => {
        // Listen for the event
        window.api.getOpSystem(setIsMacOS);
    }, []);

    console.log(appState);

    return (
        <div className="app">
            {isMacOs && <MacTitleBar />}
            {!isMacOs && <TitleBar />}
            {(appState === appStates.CONNECTING_STATE ||
                appState === appStates.AUTO_CONNECTION_STATE) && (
                <WaitingForConnection appState={appState} />
            )}
            {(appState === appStates.SELECT_IP_STATE ||
                appState === appStates.ERROR_STATE ||
                appState === appStates.ERROR_AUTO_CONNECTION_STATE ||
                appState === appStates.NO_CONNECTION_ERROR_STATE ||
                appState === appStates.ERROR_IS_NOT_SENTRY ||
                appState === appStates.RETRY_AUTO_CONNECTION_STATE) && (
                <>
                    <SetConnection
                        setAppState={setAppState}
                        appState={appState}
                        error={false}
                        setTriedAutoConnect={setTriedAutoConnect}
                        triedAutoConnect={triedAutoConnect}
                    />
                    <HelpMenu className="app-helpMenu" />
                    <div className="app-hideHelpMenu"></div>
                </>
            )}
        </div>
    );
}

export default App;
