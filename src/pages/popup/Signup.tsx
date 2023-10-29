import React, { useState } from "react";
import { checkValidateEmail } from "../../core/common";
import { auth } from "../../core/firebase";
import User from "../../models/user";
import { Button, Spin, message } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { SignupWithEandP, registerUser } from "../../API/auth"
import { ISDEV } from "../../core/helper";
const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
export default function Register({ setPageState }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const register = async () => {
        if (!checkValidateEmail(email)) {
            message.warning("Invalid Email!");
            return;
        }
        if (password == null || password.length < 6) {
            message.warning("password is short");
            return;
        }
        if (password != confirm) {
            message.warning("password is not confirm.");
            return;
        }
        if (userName == null || userName == "") {
            message.warning("userName can not be null");
            return;
        }
        setLoading(true);
        try {
            const signupResult = await SignupWithEandP({ email, password, user_name: userName });
            if (signupResult.state) {
                const user = await User._get(signupResult.uid);
                if (ISDEV) localStorage.setItem("userInfo", JSON.stringify(user));
                else chrome.storage.sync.set({ 'userInfo': user })
                message.success(signupResult.message)
                setPageState("dashboard")
            }
            else message.error(signupResult.message)
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className="bg-red-500 rouned-t-3xl" style={{ width: "300px ", height: "600px" }}>
            <img src="./assets/images/background.png" width={"100%"} className="opacity-75" />
            <div className="w-full p-5 justify-items-center bg-white rounded-t-3xl" style={{ position: "relative", bottom: "296px" }}>
                <div className="text-2xl font-bold text-center">Create Account</div>
                <div className=" text-center text-sm">Create your free account</div>
                <form className="flex flex-col mt-3 justify-items-center">
                    <input
                        type="text"
                        name="full-name"
                        className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Full Name"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type="email"
                        name="email"
                        className="px-4 py-2 mt-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        className="px-4 py-2 mt-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="repeat-password"
                        className="px-4 py-3 mt-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Repeat Password"
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </form>
                <div className="text-center">
                    <button
                        className="w-36 mt-4 px-2 py-2 text-base rounded-full text-white  bg-blue-500 "
                        onClick={() => register()}
                    >{loading ? <Spin /> : "Sign Up"}</button>
                </div>
                <div className="flex flex-col items-center mt-5">
                    <p className="mt-1 text-xs font-light text-gray-500">
                        Register already?<a className="ml-1 font-medium text-blue-400 cursor-pointer" onClick={() => setPageState("signin")}>Sign in now</a>
                    </p>
                </div>
            </div>
        </div>
    );
}