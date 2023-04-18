import "../css/AutoConnectionError.css";
import IpInput from "./IpInput";
import Title from "./Title";
function AutoConnectionError() {
    return (
        <div className="autoConnectionError">
            <Title>SEA.AI SENTRY</Title>
            <div className="autoConnectionError-message">
                Automatic connection failed. Please insert the IP address of the
                SENTRY unit.
            </div>
            <IpInput />
        </div>
    );
}

export default AutoConnectionError;
