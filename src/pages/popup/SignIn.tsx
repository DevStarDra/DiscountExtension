import React, { useState } from "react";
import { checkValidateEmail } from "../../core/common";
import { SigninWithEandP } from "../../API/auth"
import { Button, Spin, message } from "antd";
import User from "../../models/user"
import { ISDEV } from "../../core/helper";

export default function SignIn({ setPageState }) {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);

    const logIn = async () => {
        if (!checkValidateEmail(email)) {
            message.warning("Invalid Email!");
            return;
        }
        setLoading(true);
        try {
            const res = await SigninWithEandP({ email, password });
            if (res.state) {
                const user = await User._get(res.data.user.uid);
                if (ISDEV) localStorage.setItem("userInfo", JSON.stringify(user));
                else chrome.storage.sync.set({ 'userInfo': user })
                message.success("Login success")
                setPageState("dashboard")
            }
            else message.error(res.message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className="bg-red-500 rouned-t-3xl" style={{ width: "300px ", height: "585px " }}>
            <img src="./assets/images/background.png" width={"100%"} className="opacity-75" />
            <div className="w-full p-5 justify-items-center bg-white rounded-t-3xl" style={{ position: "relative", bottom: "192px" }}>
                <div className="text-2xl font-bold text-center">Sign In</div>
                <form className="flex flex-col mt-3 justify-items-center">
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
                </form>
                <div className="text-center">
                    <button
                        className="w-36 mt-4 py-2 text-base rounded-full text-white  bg-blue-500 "
                        onClick={() => logIn()}
                    >{loading ? <Spin /> : "Sign In"}</button>
                </div>
                <div className="flex flex-col items-center mt-5">
                    <p className="mt-1 text-xs font-light text-gray-500">
                        Don't have account?<a className="ml-1 font-medium text-blue-400 cursor-pointer" onClick={() => setPageState("signup")}>Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}