import React, { useState, useEffect, useContext, createContext } from "react";
import { auth } from "../core/firebase"
import User from "../models/user"
import Language from "../models/language"
import Store from "../models/store"
import Product from "../models/product"
import { SigninWithEandP, SignupWithEandP } from "../API/auth"
import { useMemoryRouter } from "./memory-router";
import { userInfo } from "os";
import { ISDEV } from "../core/helper";
import { useMultiLanguage } from "./multi-language";

const authContext = createContext(undefined);

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const router = useMemoryRouter();
    const language = useMultiLanguage();
    const signin = async ({ email, password }) => {
        const res = await SigninWithEandP({ email, password });
        if (res.state) {
            let user = await User._get(res.data.user.uid);
            let transactions = await User.getTransactions(res.data.user.uid);
            let notifications = await User.getNotifications(res.data.user.uid);
            user = { ...user, country: 'ro', transactions, notifications}
            setUser(user);

            const stores = await Store._getAll();
            router.setStores(stores)

            if (ISDEV) {
                localStorage.setItem("userInfo", JSON.stringify(user));
                localStorage.setItem('stores', JSON.stringify(stores));
                // localStorage.setItem('products', JSON.stringify(products));
            } else {
                chrome.storage.sync.set({ 'stores': stores });
                chrome.storage.sync.set({ 'userInfo': user })
            }
            let languageList = await Language._getAll();
            language.setLanguageList(languageList)
            if (ISDEV) {
                localStorage.setItem('languageList', JSON.stringify(languageList))
            } else {
                chrome.storage.sync.set({ 'languageList': languageList })
            }
        }
        return res;
    };
    const signup = async ({ email, password, user_name }) => {
        const signupResult = await SignupWithEandP({ email, password, user_name });
        if (signupResult.state) {
            const user = await User._get(signupResult.uid);
            if (ISDEV) localStorage.setItem("userInfo", JSON.stringify(user));
            else chrome.storage.sync.set({ 'userInfo': user });
            setUser(user);
        }
        return signupResult;
    };
    const signout = async () => {
        if (ISDEV) localStorage.removeItem("userInfo");
        else chrome.storage.sync.remove('userInfo');
        setUser(false);
        auth.signOut();
    };
    useEffect(() => {
        if (ISDEV) {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (!user) {
                setUser(false);
            }
            else {
                setUser(user);
            }
        }
        else chrome.storage.sync.get().then(result => {
            if (!result.userInfo) {
                setUser(false);
            }
            else {
                setUser(result.userInfo);
            }
        });
    }, []);

    return {
        user,
        setUser,
        signin,
        signup,
        signout,
        // sendPasswordResetEmail,
        // confirmPasswordReset,
    };
}