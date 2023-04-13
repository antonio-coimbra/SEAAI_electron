import "../css/WaitingForConnection.css";
import Title from "./Title";
function WaitingForConnection({ setAppState }) {
  function tryAgain() {
    setAppState("select-ip");
  }
  return (
    <div className="waitingForConnection">
      <Title>SEA.AI SENTRY</Title>
      <div className="waitingForConnection-messsage">
        Connecting to SENTRY unit...
      </div>
      <button
        className="waitingForConnection-tryAgainButton"
        onClick={tryAgain}
      >
        Retry
      </button>
    </div>
  );
}

export default WaitingForConnection;
