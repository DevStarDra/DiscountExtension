
import React, { useState } from "react";
import { getURL } from "../core/common"
import AccountItem from "./components/AccountItem";
import ToggleButton from "./components/ToggleButton";
import { Tooltip, message } from "antd";
import { isConstructSignatureDeclaration } from "typescript";
import { useMemoryRouter } from "../store/memory-router";
import { RouterConfig } from "../core/helper";
import { useAuth } from "../store/use-auth";
import { useMultiLanguage } from "../store/multi-language";

const pageData = {
    info: {
        prefix: "logoUser.svg",
        title: "personal_info"
    },
    wallet: {
        prefix: "logoWallet.svg",
        title: "wallet_cash"
    },
    alert: {
        prefix: "logoAlert.svg",
        title: "item_alerts"
    },
    promotion: {
        prefix: "logoPromotion.svg",
        title: "promotions_activity"
    },
    my_list: {
        prefix: "logoList.svg",
        title: "create_manage_list"
    },
    help: {
        prefix: "logoHelp.svg",
        title: "help_center"
    },
    logout: {
        prefix: "logoUser.svg",
        title: "logout"
    }
}
const suffix = getURL("assets/logos/iconGT.svg")

const AccountPage = () => {
    const [notification, setNotificaiton] = useState(true);
    const router = useMemoryRouter();
    const auth = useAuth();
    const language = useMultiLanguage()
    return <div className="mx-3 h-full pt-4">
        <AccountItem
            suffix={suffix}
            prefix={getURL(`assets/logos/${pageData.info.prefix}`)}
            title={language.get(pageData.info.title)}
            onTitle={() => {
                // router.setHeaderTitle("Personal Info");
                router.addPage(RouterConfig.PERSONAL_INFO)
            }}
            onSuffix={() => {
                // router.setHeaderTitle("Personal Info");
                router.addPage(RouterConfig.PERSONAL_INFO)
            }}
        />
        <AccountItem 
            suffix={suffix} 
            prefix={getURL(`assets/logos/${pageData.wallet.prefix}`)} 
            title={language.get(pageData.wallet.title)} 
            onTitle={() => {
                // router.setHeaderTitle("Personal Info");
                router.addPage(RouterConfig.WALLET)
            }}
            onSuffix={() => {
                // router.setHeaderTitle("Personal Info");
                router.addPage(RouterConfig.WALLET)
        }}/>
        <div className="flex flex-row justify-between p-3-5 items-center">
            <div className="text-xl">{language.get('notifications')}</div>
            <ToggleButton check={notification} setCheck={setNotificaiton} />
        </div>

        <AccountItem suffix={suffix} prefix={getURL(`assets/logos/${pageData.alert.prefix}`)} title={language.get(pageData.alert.title)} />
        <AccountItem suffix={suffix} prefix={getURL(`assets/logos/${pageData.promotion.prefix}`)} title={language.get(pageData.promotion.title)} />
        <div className="flex flex-row justify-between p-2-5 items-center">
            <div className="text-xl pt-3">{language.get('my_lists')}</div>
        </div>
        <AccountItem suffix={suffix} prefix={getURL(`assets/logos/${pageData.my_list.prefix}`)} title={language.get(pageData.my_list.title)} />
        <div className="flex flex-row justify-between p-2-5 items-center">
            <div className="text-xl pt-3">{language.get('more')}</div>
        </div>
        <AccountItem suffix={suffix} prefix={getURL(`assets/logos/${pageData.help.prefix}`)} title={language.get(pageData.help.title)} />

        <AccountItem suffix={suffix}

            prefix={getURL(`assets/logos/${pageData.logout.prefix}`)}
            onTitle={() => { router.addPage(RouterConfig.HOME); auth.signout(); }}
            onSuffix={() => { router.addPage(RouterConfig.HOME); auth.signout(); }}
            title={language.get(pageData.logout.title)} />
    </div>
}

export default AccountPage;