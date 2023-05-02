import { useEffect, useState } from "react";
import { appStates } from "./shared/constants";
import TitleBar from "./components/TitleBar";
import MacTitleBar from "./components/MacTitleBar";
import SetConnection from "./components/SetConnection";
import WaitingForConnection from "./components/WaitingForConnection";
import "./css/App.css";

function App() {
    // debugger;
    const [appState, setAppState] = useState(appStates.SELECT_IP_STATE);
    const [triedAutoConnect, setTriedAutoConnect] = useState(false);
    const [isMacOs, setIsMacOS] = useState(null);

    useEffect(() => {
        // Listen for the event
        window.api.getAppState(setAppState);
    }, []);

    useEffect(() => {
        // Listen for the event
        window.api.getOpSystem(setIsMacOS);
    }, []);

    return (
        <div className="App">
            {isMacOs && <MacTitleBar />}
            {!isMacOs && <TitleBar />}
            {(appState === appStates.CONNECTING_STATE ||
                appState === appStates.AUTO_CONNECTION_STATE) && (
                <WaitingForConnection appState={appState} />
            )}
            {(appState === appStates.SELECT_IP_STATE ||
                appState === appStates.ERROR_STATE ||
                appState === appStates.ERROR_AUTO_CONNECTION_STATE ||
                appState === appStates.NO_CONNECTION_ERROR_STATE) && (
                <SetConnection
                    setAppState={setAppState}
                    appState={appState}
                    error={false}
                    setTriedAutoConnect={setTriedAutoConnect}
                    triedAutoConnect={triedAutoConnect}
                />
            )}
        </div>
    );
}

export default App;
