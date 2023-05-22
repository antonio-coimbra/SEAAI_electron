import React, { useState, useEffect } from "react";
import "../css/IpInput.css";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import { ReactComponent as ChevronLeft } from "../images/chevron-left.svg";
const { regEx, appStates } = require("../shared/constants");
let error = null;

function IpInput({
    appState,
    setAppState,
    setTriedAutoConnect,
    startInput,
    setStartInput,
}) {
    const [valid, setValid] = useState(regEx.test(startInput)); //true only for testing
    const [subFailed, setSubFailed] = useState(false);
    const [input, setInput] = useState(startInput); // 172.17.86.153 only for testing

    switch (appState) {
        default: {
            error = null;
            break;
        }
        case appStates.NO_CONNECTION_ERROR_STATE: {
            error =
                "Connection failed. Please check your internet and try again.";
        }
        case appStates.ERROR_STATE: {
            error = "IP address not reachable. Please try again.";
            break;
        }
        case appStates.ERROR_IS_NOT_SENTRY: {
            error = "IP address not recognized as a SEA.AI product.";
            break;
        }
    }

    function handleUserInput(e) {
        error = false;
        const trimedInput = e.target.value.trim();

        setValid(regEx.test(trimedInput));
        setInput(trimedInput);
        if (input === "") {
            setSubFailed(false);
        }
    }

    function handleSubmit(e) {
        error = null;
        setTriedAutoConnect(false);
        e.preventDefault();
        setSubFailed(true);
        if (valid) {
            setSubFailed(false);
            console.log(`Submited IP: ${input}`);
            setStartInput(input);
            window.api.sendIP(input);
        }
    }

    function goBack() {
        setAppState(appStates.RETRY_AUTO_CONNECTION_STATE);
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
                <StandardButton type="submit">Connect to IP</StandardButton>
            </form>
            {subFailed && !valid && (
                <ErrorMessage>
                    This address is invalid. Please try again.
                </ErrorMessage>
            )}
            {error && !subFailed && valid && (
                <ErrorMessage>{error}</ErrorMessage>
            )}
            <div className="ipInput-goBack" onClick={goBack}>
                <ChevronLeft />
                Go Back
            </div>
        </div>
    );
}

export default IpInput;
