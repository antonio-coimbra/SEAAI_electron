import "../css/WaitingForConnection.css";
import Title from "./Title";
function WaitingForConnection({ setAppState }) {
    return (
        <div className="waitingForConnection">
            <Title>SEA.AI SENTRY</Title>
            <div className="waitingForConnection-messsage">
                Connecting to SENTRY unit...
            </div>
        </div>
    );
}

export default WaitingForConnection;
