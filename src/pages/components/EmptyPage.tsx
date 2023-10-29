import React from "react";

const EmptyPage = ({icon, message}) => {

    return <div className="flex flex-col p-8 items-center">
        <img style={{width: 100, height: 100}} src={icon}/>
        <div style={{fontSize: 26, textAlign:'center', paddingTop: 20}}>{message}</div>
    </div>
}

export default EmptyPage