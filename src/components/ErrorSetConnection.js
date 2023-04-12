import "../css/ErrorSetConnection.css";
import IpInput from "./IpInput";
import Title from "./Title";
function ErrorSetConnection({ setAppState }) {
    return (
        <div className="errorSetConnection">
            <Title>SEA.AI SENTRY</Title>
            <div className="errorSetConnection-message">
                The IP adress you selected was unreachable. Please check your
                connection and try again
            </div>
            <IpInput />
        </div>
    );
}

export default ErrorSetConnection;
