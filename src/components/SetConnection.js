import "../css/SetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
function SetConnection({ setAppState }) {
    return (
        <div className="setConnection">
            <Title>SEA.AI SENTRY</Title>
            <IpInput />
        </div>
    );
}

export default SetConnection;
