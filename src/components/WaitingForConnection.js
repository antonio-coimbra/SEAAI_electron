import "../css/WaitingForConnection.css";
import Title from "./Title";
import StandardButton from "./StandardButton";
function WaitingForConnection({ setAppState }) {
    function tryAgain() {
        setAppState("select-ip");
    }
    return (
        <div className="waitingForConnection">
            <Title>SEA.AI SENTRY</Title>
            <div className="waitingForConnection-message">
                Connecting to SENTRY unit...
            </div>
            <StandardButton onClick={tryAgain}>Retry</StandardButton>
        </div>
    );
}

export default WaitingForConnection;
