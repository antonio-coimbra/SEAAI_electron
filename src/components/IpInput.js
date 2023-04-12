import React, { useState } from "react";
import "../css/IpInput.css";
import ConnectButton from "./ConnectButton";
const { regEx } = require("../shared/constants");

function IpInput() {
    const [valid, setValid] = useState(null);
    const [input, setInput] = useState("");
    const [subFailed, setSubFailed] = useState(false);

    function handleUserInput(e) {
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
            window.api.getIP(input);
        }
    }

    return (
        <form className="ipInput" method="post" onSubmit={handleSubmit}>
            <label className="ipInput-form">
                IP address:
                <input
                    className="ipInput-form-textEntry"
                    type="text"
                    placeholder="000.00.00.000"
                    defaultValue="172.17.86.154"
                    autoFocus={true}
                    onChange={handleUserInput}
                />
            </label>
            <div className="ipInput-errorMessage">
                {subFailed && !valid ? "Please insert a valid IP address" : ""}
            </div>
            <ConnectButton />
        </form>
    );
}

export default IpInput;
