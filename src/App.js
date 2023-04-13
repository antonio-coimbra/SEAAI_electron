import { useEffect, useState } from "react";

import ErrorSetConnection from "./components/ErrorSetConnection";
import SetConnection from "./components/SetConnection";
import TitleBar from "./components/TitleBar";
import WaitingForConnection from "./components/WaitingForConnection";

function App() {
  // debugger;
  const [appState, setAppState] = useState("select-ip");

  useEffect(() => {
    // Listen for the event
    window.api.getAppState(setAppState);
  }, []);

  // webservice();
  return (
    <div className="App">
      <TitleBar />
      {appState === "select-ip" && <SetConnection />}
      {appState === "connecting" && (
        <WaitingForConnection setAppState={setAppState} />
      )}
      {appState === "error" && <ErrorSetConnection />}
    </div>
  );
}

export default App;
