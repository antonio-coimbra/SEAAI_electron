import { useEffect, useState } from "react";

import TitleBar from "./components/TitleBar";
import AutoConnection from "./components/AutoConnection";
import SetConnection from "./components/SetConnection";
import WaitingForConnection from "./components/WaitingForConnection";
import ErrorSetConnection from "./components/ErrorSetConnection";

function App() {
    // debugger;
    const [appState, setAppState] = useState("auto-connection");

    useEffect(() => {
        // Listen for the event
        window.api.getAppState(setAppState);
    }, []);

    // webservice();
    return (
        <div className="App">
            <TitleBar />
            {appState === "auto-connection" && (
                <AutoConnection setAppState={setAppState} />
            )}
            {appState === "connecting" && (
                <WaitingForConnection setAppState={setAppState} />
            )}
            {appState === "select-ip" && <SetConnection />}
            {appState === "error" && <ErrorSetConnection />}
        </div>
    );
}

export default App;
