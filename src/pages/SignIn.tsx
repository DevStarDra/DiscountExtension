import React, { useState } from "react";
import { checkValidateEmail } from "../core/common";
import { SigninWithEandP } from "../API/auth"
import { Button, Spin, message } from "antd";
import { getURL } from "../core/common";
import User from "../models/user"
import { useAuth } from "../store/use-auth"

export default function SignIn({ setPageState, nextPage }) {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const auth = useAuth();

    const logIn = async () => {
        if (!checkValidateEmail(email)) {
            message.warning("Invalid Email!");
            return;
        }
        setLoading(true);
        try {
            await auth.signin();
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className="bg-red-500 rounded-t-lg w-full h-full" >
            <img src={getURL("assets/images/background.png")} className="opacity-75 w-full" />
            <div className="p-5 justify-items-center bg-white rounded-t-3xl relative" style={{ bottom: "189px", height: "40%" }}>
                <div className="text-2xl font-bold text-center">Sign In</div>
                <form className="flex flex-col mt-3 justify-items-center">
                    <input
                        type="email"
                        name="email"
                        className="px-4 py-2 mx-auto mt-4 w-80p rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        className="px-4 py-2 mx-auto mt-8 w-80p rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </form>
                <div className="text-center">
                    <button
                        className="w-36 mt-8 py-2 text-base rounded-full text-white  bg-blue-500 border-transparent cursor-pointer"
                        onClick={() => logIn()}
                    >{loading ? <Spin /> : "Sign In"}</button>
                </div>
                <div className="flex flex-col items-center mt-8">
                    <p className="mt-1 text-xs font-light text-gray-500">
                        Don't have account?<a className="ml-1 font-medium text-blue-400 cursor-pointer" onClick={() => setPageState("signup")}>Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}