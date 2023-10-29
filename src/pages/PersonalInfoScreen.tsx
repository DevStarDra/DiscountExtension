import React, { useEffect, useState } from "react";
import { useAuth } from "../store/use-auth"
import { useMemoryRouter } from "../store/memory-router";
import Select from "./components/Select";
import CustomCalendar from "./components/CustomCalendar";
import { getURL } from "../core/common";
import Button from "./components/Button";
import User from "../models/user"
import { NotificationManager } from 'react-notifications';
import { devNull } from "os";
import { genModalMaskStyle } from "antd/es/modal/style";
import { union } from "lodash";
import { ISDEV } from "../core/helper";
import { useMultiLanguage } from "../store/multi-language";


const genderOptions = [
    {
        index: 0,
        value: 0,
        label: "I don’t want to share"
    },
    {
        index: 1,
        value: 1,
        label: "male"
    },
    {
        index: 2,
        value: 2,
        label: "female"
    },
]

const currencyOptions = [
    {
        index: 0,
        value: "ron",
        label: "RON",
        img: getURL("assets/flags/ro.svg")
    },
    {
        index: 1,
        value: "usd",
        label: "USA",
        img: getURL("assets/flags/en.svg")
    }
]


const PersonalInfoScreen = () => {
    const auth = useAuth();
    const [user, setUser] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [languageOptions, setLanguageOptions] = useState([])
    const memoryRouter = useMemoryRouter();
    const language = useMultiLanguage();
    useEffect(() => {
        setUser(auth.user)
    }, [auth])

    useEffect(() => {
        if (!language.languageList && language.languageList.length == 0) {
            setLanguageOptions([])
        } else {
            let options = [];
            language.languageList.map((element, index) => {
                options.push({
                    index: index,
                    img: getURL(`assets/flags/${element.lang_iso}.svg`),
                    value: element.lang_iso,
                    label: element.lang_name
                })
            })
            setLanguageOptions(options)
        }
    }, [, language.languageList])

    const InfoSection1 = ({ title, value, disabled = false, placeholder = "Enter a value", onChange, tabIndex }) => {
        const [v, setV] = useState(value)
        return <div className="mx-3">
            <div className="w-full p-2-5" >
                <div>{title}</div>
                <input className="flex items-center pl-5 mt-1 ml-1 mr-4 bg-neutral-200 text-xs"
                    style={{ borderRadius: "10px", height: "48px", width: "85%", border: "none" }}
                    value={v}
                    // onChange={onChange}
                    onChange={(e) => setV(e.target.value)}
                    onBlur={() => onChange(v)}
                    disabled={disabled}
                    placeholder={placeholder}
                    tabIndex={tabIndex}
                />
            </div>
        </div>
    }

    const GenderSelection = () => {
        const [selected, setSelected] = useState(0);
        const onChange = (index) => {
            setUser({ ...user, gender: genderOptions[index].value })
        }
        useEffect(() => {
            if (user && user.gender) {
                setSelected(genderOptions.filter((item) => item.value === user.gender)[0].index)
            }
        }, [user])
        return <div className="mx-3" >
            <div className="w-full p-2-5">
                <div>{language.get('gender')}</div>
                <Select
                    options={genderOptions}
                    selected={selected}
                    onChange={onChange}
                />
            </div>
        </div>
    }

    const BirthdaySelection = () => {
        const [value, setValue] = useState(new Date())

        const onChange = (v) => {
            setUser({ ...user, birthday: v.toString() })
        }
        useEffect(() => {
            if (user && user.birthday) {
                setValue(new Date(user.birthday))
            }
        }, [user])
        return <div className="mx-3">
            <div className="w-full p-2-5">
                <div className="py-2-5">{language.get('birthday')}</div>
                <CustomCalendar value={value} onChange={onChange} />
            </div></div>
    }

    const CurrencySelection = () => {
        const [selected, setSelected] = useState(0);
        const onChange = (index) => {
            setUser({ ...user, currency: currencyOptions[index].value })
        }
        useEffect(() => {
            if (user && user.currency) {
                setSelected(currencyOptions.filter((item) => item.value === user.currency)[0].index)
            }
        }, [user])
        return <div className="mx-3">
            <div className="w-full p-2-5" >
                <div className="py-2-5">{language.get('currency')}</div>
                <Select options={currencyOptions} selected={selected} onChange={onChange} />
            </div>
        </div>
    }

    const LanguageSelection = () => {
        const [selected, setSelected] = useState(0);
        const onChange = (index) => {
            setUser({ ...user, language: languageOptions[index].value })
        }
        useEffect(() => {
            if (user && user.language) {
                setSelected(languageOptions.filter((item) => item.value === user.language)[0].index)
            }
        }, [user])
        return <div className="mx-3">
            {languageOptions.length > 0 && <div className="w-full p-2-5" >
                <div className="py-2-5">{language.get('language')}</div>
                <Select options={languageOptions} selected={selected} onChange={onChange} />
            </div>}
        </div>
    }

    const upLoadUserData = async () => {
        setUploading(true);
        try {
            let gender = user.gender, _language = user.language, birthday = user.birthday, currency = user.currency;
            if (gender == undefined) gender = 0;
            if (_language == undefined) _language = 'en';
            if (birthday == undefined) birthday = new Date().toString();
            if (currency == undefined) currency = 'usa';
            const resp = await User._update(user.id_user, { ...user, gender, language : _language, birthday, currency });
            if (resp.state) {
                NotificationManager.success("Success Update", "", 2000);
                auth.setUser(user)
                if (ISDEV) localStorage.setItem('userInfo', JSON.stringify(user))
                else chrome.storage.sync.set({ 'userInfo': user }) 
                language.setLocale(_language);
            }
            else
                NotificationManager.error("Fail Update", "", 2000);
            setUploading(false)
        } catch {
            err => {
                setUploading(false)
                // console.log(err)
            }
        }

        setUploading(false)
    }

    return (
        <><link rel="stylesheet" type="text/css" href={getURL("assets/css/Calendar.css")} />
        <div id="sidebar-content-inner" style={{ height: "98%" }}>
            <InfoSection1
                title={"First name"}
                value={user && user.first_name ? user.first_name : ""}
                onChange={(value) => setUser({ ...user, first_name: value })}
                tabIndex={1}
            />
            <InfoSection1 
                title={"Last name"} 
                value={user && user.last_name ? user.last_name : ""} 
                placeholder="Enter your last name" 
                onChange={(value) => setUser({ ...user, last_name: value })}
                tabIndex={2} />
            <InfoSection1 title={`${language.get('e_mail')} ${language.get('address')}`} value={user && user.email ? user.email : ""} disabled={true} onChange={() => { }} tabIndex={3}/>
            <GenderSelection />
            <BirthdaySelection />
            <CurrencySelection />
            <LanguageSelection />
            <div className="flex items-center justify-center mt-4">
                <Button
                    className="w-36 py-2 text-base rounded-full text-white  bg-blue-500 border-transparent cursor-pointer"
                    onSubmit={() => upLoadUserData()}
                    text={language.get('save')}
                    loading={uploading}
                />
            </div>
        </div></>
    );
}
export default PersonalInfoScreen;