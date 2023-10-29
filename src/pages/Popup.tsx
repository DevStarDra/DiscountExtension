import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../core/firebase";
import { SigninWithEandP, SignupWithEandP } from "../API/auth"
import SignIn from "./SignIn";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import { ISDEV } from "../core/helper";

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

    return <div className="w-full h-full">
        {pageState === "signin" ?
            <SignIn setPageState={setPageState} nextPage={"dashboard"} /> :
            pageState === "signup" ?
                <Signup setPageState={setPageState} nextPage={"signin"} /> :
                pageState === "dashboard" ?
                    <Dashboard setPageState={setPageState} /> : null}
    </div>
}
export default Popup;