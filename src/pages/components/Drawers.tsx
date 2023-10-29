import React, { useEffect, useState } from "react";
import { checkValidateEmail, generateShadowRootId, getURL } from "../../core/common";
import { SigninWithEandP, SignupWithEandP } from "../../API/auth"
import { NotificationManager } from "react-notifications"
import { Spin, message } from "antd";
import Button from "./Button"
import User from "../../models/user"
import { useAuth } from "../../store/use-auth"
import { RouterConfig } from "../../core/helper";
import { useMemoryRouter } from "../../store/memory-router";
import ChromeAPI from "../../API/chromeAPI";
import { useMultiLanguage } from "../../store/multi-language";

const SignIn = ({ onSuccess, onError, onClickSignUp }) => {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const auth = useAuth();
    const language = useMultiLanguage();

    const logIn = async () => {
        if (!checkValidateEmail(email)) {
            NotificationManager.error("Invalid Email!", "", 1500);
            return;
        }
        setLoading(true);
        try {
            const res = await auth.signin({ email, password })
            setLoading(false);
            if (res.state) onSuccess();
            else onError(res.message)
        } catch (error) {
            setLoading(false);
        }
    }

    return (

        <div className="justify-items-center bg-white rounded-t-3xl relative" style={{ top: 0, height: "40%" }}>
            <div className="text-2xl font-bold text-center p-3-5 rounded-md bg-gray-200">{language.get("login")}</div>
            <form className="flex flex-col mt-3 px-8 justify-items-center">
                <input
                    type="email"
                    name="email"
                    className="px-4 py-2 mx-auto mt-4 w-80p rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                    placeholder={language.get('e_mail')}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    className="px-4 py-2 mx-auto mt-8 w-80p rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                    placeholder={language.get('enter_your_password')}
                    onKeyDown={(e)=>{
                        if(e.keyCode == 13){
                            logIn();
                        }
                    }}
                    onChange={(e) => {
                        setPassword(e.target.value)}
                    }
                />
            </form>
            <div className="text-center">
                <Button
                    className="w-36 mt-8 py-2 text-base rounded-full text-white  bg-blue-500 border-transparent cursor-pointer"
                    onSubmit={() => logIn()}
                    text={language.get('login')}
                    loading={loading}
                />
            </div>
            <div className="flex flex-col items-center mt-8 ">
                <p className="mt-1 mb-7 text-xs font-light text-gray-500">
                    {language.get('don_t_have_an_account')}<a className="ml-1 font-medium text-blue-400 cursor-pointer" onClick={() => onClickSignUp()}>{language.get("sign_up")}</a>
                </p>
            </div>
        </div>
    );
}


const Signup = ({ onSuccess, onError, onClickSignIn }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const auth = useAuth()
    const language = useMultiLanguage()

    const register = async () => {
        if (!checkValidateEmail(email)) {
            NotificationManager.error("Invalid Email!", "", 1500);
            return;
        }
        if (password == null || password.length < 6) {
            NotificationManager.error('Password is too short.', '', 1500)
            return;
        }
        if (userName == null || userName == "") {
            NotificationManager.error('Username can not be null.', '', 1500)
            return;
        }
        setLoading(true);
        try {
            const res = await auth.signup({ email, password, user_name: userName });
            setLoading(false);
            if (res.state) onSuccess();
            else onError(res.message)
        } catch (error) {
            setLoading(false);
        }
    }

    return (<div className="justify-items-center bg-white rounded-t-3xl relative" style={{ top: 0, height: "50%" }}>
        <div className="text-2xl p-3-5 font-bold text-center bg-gray-200 rounded-md">{language.get('create_account')}</div>
        <div className=" text-center pt-1 text-sm">{language.get('create_your_free_account')}</div>
        <form className="flex flex-col mt-2 px-8 justify-items-center">
            <input
                type="text"
                name="full-name"
                className="px-4 py-2 mt-2 w-80p mx-auto rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                placeholder={language.get('full_name')}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="email"
                name="email"
                className="px-4 py-2 mt-8 w-80p mx-auto rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                placeholder={language.get('e_mail')}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                name="password"
                className="px-4 py-2 mt-8 w-80p mx-auto rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                placeholder={language.get('password')} 
                onKeyDown={(e)=>{
                    if(e.keyCode == 13){
                        register();
                    }
                }}
                onChange={(e) => { 
                    setPassword(e.target.value)
                }}
            />
        </form>
        <div className="text-center">
            <Button
                className="w-36 mt-4  px-2 py-2 text-base rounded-full text-white  bg-blue-500 border-transparent cursor-pointer"
                onSubmit={() => register()}
                loading={loading}
                text={language.get('sign_up')} />
        </div>
        <div className="flex flex-col items-center mt-4">
            <p className="mt-4 mb-7 text-xs  font-light text-gray-500">
                {language.get('already_have_an_account')}<a className="ml-1  font-medium text-blue-400 cursor-pointer" onClick={() => onClickSignIn()}>{language.get('sign_in_now')}</a>
            </p>
        </div>
    </div>
    );
}

export const AuthDrawer = ({ isVisible, setIsVisible, content }) => {
    const [pageState, setPageState] = useState("signin");
    const auth = useAuth();
    const memoryRouter = useMemoryRouter();
    const language = useMultiLanguage();
    useEffect(() => {
        if (!auth.user) {
            setIsVisible(true);
        }
        else {
            // memoryRouter.addPage(RouterConfig.USER);
        }
    }, []);

    return  <>
    <link rel="stylesheet" type="text/css" href={getURL("assets/css/drawer.css")} /><div className="h-full w-full bg-white">
        {content}
        {isVisible && <div className="drawer-container">
            <div className="drawer__backdrop rbd-db" style={{ opacity: 1 }} onClick={() => { memoryRouter.addPage(RouterConfig.HOME) }}></div>
            <div className="drawer rbd-dr" style={{ transform: "none", height: pageState == "signin" ? "47%" : "55%" }}>
                <div className="drawer__content rbd-cw">
                    {pageState == "signin" ?
                        <SignIn onSuccess={() => {  NotificationManager.success(language.get('success_login'), "", 2000); setIsVisible(false) }}
                            onError={(msg) => NotificationManager.error(msg, "", 2000)} onClickSignUp={() => setPageState("signup")} />
                        : (pageState == "signup" ?
                            <Signup onSuccess={() => { NotificationManager.success("Success Signup", "", 2000); setIsVisible(false) }}
                                onError={(msg) => NotificationManager.error(msg, "", 2000)} onClickSignIn={() => setPageState("signin")} /> : null)}
                </div>
                <div className="close-button" onClick={() => memoryRouter.addPage(RouterConfig.HOME)}>X</div>
            </div>
        </div>}
    </div>
    </>
}