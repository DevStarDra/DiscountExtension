import React from "react";

const AccountItem = ({ prefix, title, suffix, onPrefix = null, onTitle = null, onSuffix = null }) => {
    return <div className="account-item" onClick={() => typeof (onSuffix) == "function" && onSuffix()} >
        <span style={{ left: 10 }}><img src={prefix} style={{ width: "60%" }} onClick={() => typeof (onPrefix) == "function" && onPrefix()} /></span>
        <div className="text-xs pl-11 relative" onClick={() => typeof (onTitle) == "function" && onTitle()} >{title}</div>
        <span><img src={suffix} style={{ height: "15px" }} onClick={() => typeof (onSuffix) == "function" && onSuffix()} /></span>
    </div>;
}

export default AccountItem;