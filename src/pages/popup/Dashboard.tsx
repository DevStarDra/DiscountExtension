import React, { useEffect, useState } from "react";
import { auth } from "../../core/firebase"
import { Button, Select, Spin, message } from "antd";
import Item from "antd/es/list/Item";
import User from "../../models/user";
import { getURL } from "../../core/common"
import { ISDEV } from "../../core/helper";
const languageOptions = [
    {
        img: "us.svg",
        value: "us",
        label: "English(USA)"
    },
    {
        img: "ro.svg",
        value: "ro",
        label: "Romanian"
    }
];

export default function Dashboard({ setPageState }) {
    const [language, setLanguage] = useState("ro");
    const [user, setUser] = useState({ id_user: "" });
    const Signout = () => {
        auth.signOut();
        if (ISDEV) localStorage.removeItem("userInfo");
        else chrome.storage.sync.remove('userInfo');
        setPageState("signin");
    }

    useEffect(() => {
        if (ISDEV) {
            const _user = JSON.parse(localStorage.getItem("userInfo"));
            setUser({ ..._user });
            if (_user.language)
                setLanguage(_user.language);
        }
        else chrome.storage.sync.get().then(result => {
            if (result.userInfo) {
                setUser({ ...result.userInfo })
                if (result.userInfo.language)
                    setLanguage(result.userInfo.language)
            }
        })
    }, []);

    const changeLanguage = (value) => {
        User._update(user.id_user, { ...user, language: value });
        setLanguage(value);
        if (ISDEV) {
            localStorage.setItem('userInfo', JSON.stringify({ ...user, language: value }));
        }
        else {
            chrome.storage.sync.set({ 'userInfo': { ...user, language: value } });
        }
    }

    return (
        <div className="bg-red-500 rouned-t-3xl" style={{ width: "300px", height: "600px" }}>
            <img src={"./assets/images/discount-white.png"} width={180} style={{ margin: "auto", position: "absolute", top: "160px", left: "60px" }} />
            <div id="counter-selector" style={{ position: "relative", top: "220px", textAlign: "center" }}>
                <Select
                    value={language}
                    style={{ width: 180 }}
                    listHeight={250}
                    onChange={(e) => changeLanguage(e)}
                    listItemHeight={20}
                >
                    {languageOptions.map((item, index) => {
                        return <Select.Option value={item.value} key={index}>
                            <div className="flex flex-row justify-items-between py-1" style={{ height: "40px !important" }} >
                                <img src={`./assets/flags/${item.img}`} width={25} />
                                <div className="text-sm ml-4">{item.label}</div>
                            </div>
                        </Select.Option>
                    })}
                </Select>
            </div>
            <div className="text-center" style={{ position: "relative", top: "480px", margin: "auto" }}>
                <button
                    className="w-36 mt-4 px-2 py-2 text-base rounded-full text-white  bg-blue-500 "
                    onClick={() => Signout()}>
                    Sign out
                </button>
            </div>
        </div>
    );
}