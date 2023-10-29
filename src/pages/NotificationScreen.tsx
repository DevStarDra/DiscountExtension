import React, { useEffect, useState } from "react";
import EmptyPage from "./components/EmptyPage";
import { getURL } from "../core/common";
import useSelection from "antd/es/table/hooks/useSelection";
import NotificationCard from "./components/NotificationCard";
import { setFips } from "crypto";
import { useAuth } from "../store/use-auth";
import moment from "moment";
import { AutoApply } from "../core/autoApply";
 

const NotificationFilter = [
    {
        label: "Latest",
        value: 'latest',
    },
    {
        label: "This week",
        value: 'week',
    },
    {
        label: "This month",
        value: 'month',
    },
    {
        label: "This year",
        value: 'year',
    }
]

const getFilterNotifications = (arr, filter) =>{
    if(!Array.isArray(arr)) return [];
    arr.sort((a, b)=> b.date_add.seconds - a.date_add.seconds);
    if(filter == 'latest') return arr.slice(0, 10);
    const today = new Date();
    let startOfWeek = null, endOfWeek = null;
    if(filter == 'week'){
        startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
    }else if(filter == 'month'){
        startOfWeek = new Date(today.getFullYear(), today.getMonth(), 0);
        endOfWeek = new Date(today.getFullYear(), today.getMonth()+1, 0);
    }else if(filter == 'year'){
        startOfWeek = new Date(today.getFullYear(), 0, 0, 23, 59, 59);
        endOfWeek = new Date(today.getFullYear()+1, 0, 0, 23, 59, 59);
    }
    if(startOfWeek && endOfWeek){
        return arr.filter((e)=>e.date_add.seconds >= startOfWeek.getTime()/1000 && e.date_add.seconds <= endOfWeek.getTime()/1000);
    }
    return arr;
}

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, SetFilter] = useState(NotificationFilter[0].value);
    const auth = useAuth();

    useEffect(()=>{
        if(auth.user && auth.user.notifications){ 
            setNotifications(getFilterNotifications(auth.user.notifications, filter));    
        }
    }, [auth, filter])

    return <><link rel="stylesheet" type="text/css" href={getURL("assets/css/select.css")} />
    <div className="h-full mx-3">
        <div className="flex flex-row my-4 mx-2"> 
            {NotificationFilter.map((item, index)=>{
                return <div key={index} className={`select-filter-1${filter==item.value?"-s":""}`} onClick={()=>SetFilter(item.value)}>
                <div style={{fontSize: 11}}>{item.label}</div>
            </div>
            })}
        </div>
        {notifications.length > 0 ? <div style={{
            paddingLeft: 5, paddingRight: 5,
            maxHeight: 580, overflowY: 'auto'
        }}>
            {notifications.map((element, index)=>{
                return <NotificationCard key={index} item={element}/>
            })}
        </div>
        : 
        <div className="h-full flex flex-row items-center justify-center">
            <EmptyPage 
                icon={getURL('assets/logos/iconBell.svg')}
                message={"No notifications"}
                />  
        </div>}
    </div></>
};

export default NotificationScreen
