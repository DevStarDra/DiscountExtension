import React, { useState, useEffect } from "react";
import SignIn from "./SignIn";
// import Register from "./Signup";
import Dashboard from "./Dashboard";
import Signup from "../Signup";
import Register from "./Signup";
import { ISDEV } from "../../core/helper";

function Popup() {
    const [user, setUser] = useState(null);
    const [pageState, setPageState] = useState("signin");

    useEffect(() => {
        if (ISDEV) {
            const _user = localStorage.getItem("userInfo");
            setUser(_user);
            if (!_user)
                setPageState("signin");
            else setPageState("dashboard");
        }
        else chrome.storage.sync.get().then(result => {
            if (result.userInfo) {
                setUser(result.userInfo);
                setPageState('dashboard')
            }
            else setPageState('signin')
        })
    }, []);

    return <div>
        {pageState === "signin" ?
            <SignIn setPageState={setPageState} /> :
            pageState === "signup" ?
                <Register setPageState={setPageState} /> :
                pageState === "dashboard" ?
                    <Dashboard setPageState={setPageState} /> : null}
    </div>
}
export default Popup;