import React, { useState } from "react";
import "../css/IpInput.css";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import connect from "../images/connect.svg";
const { regEx, appStates } = require("../shared/constants");
let error = null;

function IpInput({ appState, triedAutoConnect, setTriedAutoConnect }) {
    const [valid, setValid] = useState(true); // only for testing
    const [input, setInput] = useState("172.17.86.154"); // only for testing
    const [subFailed, setSubFailed] = useState(false);

    switch (appState) {
        default: {
            error = null;
            break;
        }
        case appStates.ERROR_AUTO_CONNECTION_STATE: {
            triedAutoConnect
                ? (error =
                      "Automatic connection failed. Please insert the IP address of the SENTRY unit.")
                : (error = null);
            break;
        }
        case appStates.NO_CONNECTION_ERROR_STATE: {
            error =
                "Connection failed. Please check your internet access and try again.";
            break;
        }
        case appStates.ERROR_STATE: {
            error = "Address not reachable. Please try again.";
        }
    }

    function handleUserInput(e) {
        error = false;
        setTriedAutoConnect(false);
        setValid(regEx.test(e.target.value));
        setInput(e.target.value);
        if (e.target.value === "") {
            setSubFailed(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubFailed(true);
        if (valid) {
            setSubFailed(false);
            console.log(`Submited IP: ${input}`);
            window.api.sendIP(input);
        }
    }

    return (
        <div className="ipInput">
            <form
                className="ipInput-form"
                method="post"
                onSubmit={handleSubmit}
            >
                <input
                    className="ipInput-form-textEntry"
                    type="text"
                    placeholder="000.000.000.000"
                    defaultValue={input}
                    autoFocus={true}
                    onChange={handleUserInput}
                />
                <StandardButton type="submit" icon={connect}>
                    Connect to Sentry
                </StandardButton>
            </form>
            {triedAutoConnect && <ErrorMessage>{error}</ErrorMessage>}
            {subFailed && !valid && (
                <ErrorMessage>
                    This address is invalid. Please try again.
                </ErrorMessage>
            )}
            {error && !triedAutoConnect && <ErrorMessage>{error}</ErrorMessage>}
        </div>
    );
}

export default IpInput;
