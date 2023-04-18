import { useEffect, useState } from "react";
import { appStates } from "./shared/constants";
import TitleBar from "./components/TitleBar";
import AutoConnection from "./components/AutoConnection";
import SetConnection from "./components/SetConnection";
import WaitingForConnection from "./components/WaitingForConnection";
import ErrorSetConnection from "./components/ErrorSetConnection";
import AutoConnectionError from "./components/AutoConnectionError";

function App() {
    // debugger;
    const [appState, setAppState] = useState(appStates.AUTO_CONNECTION_STATE);

    useEffect(() => {
        // Listen for the event
        window.api.getAppState(setAppState);
    }, []);

    return (
        <div className="App">
            <TitleBar />
            {appState === appStates.AUTO_CONNECTION_STATE && (
                <AutoConnection setAppState={setAppState} />
            )}
            {appState === appStates.CONNECTING_STATE && (
                <WaitingForConnection setAppState={setAppState} />
            )}
            {appState === appStates.SELECT_IP_STATE && <SetConnection />}
            {appState === appStates.ERROR_STATE && <ErrorSetConnection />}
            {appState === appStates.ERROR_AUTO_CONNECTION_STATE && (
                <AutoConnectionError />
            )}
        </div>
    );
}

export default App;
