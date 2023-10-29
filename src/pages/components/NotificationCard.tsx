import moment from "moment";
import React from "react";
const formatAddTime = (add_date) => {
    let created = moment(add_date.seconds*1000);
    let current = moment(new Date());
    let diffInMoths = current.diff(created, 'months');
    if(diffInMoths) return diffInMoths + ` month${diffInMoths>1?`s`:""} ago`;
    let diffInDays = current.diff(created, 'days');
    if(diffInDays) return diffInDays + ` day${diffInDays>1?`s`:""} ago`;
    let diffInHours = current.diff(created, 'hours');
    if(diffInHours) return diffInHours + ` hour${diffInHours>1?`s`:""} ago`;
    let diffInMinutes = current.diff(created, 'minutes');
    if(diffInMinutes) return diffInMinutes + ` minute${diffInMinutes>1?`s`:""} ago`;
    let diffInSeconds = current.diff(created, 'seconds');
    if(diffInSeconds) return diffInSeconds + ` second${diffInSeconds>1?`s`:""} ago`;
    return "";
}
const NotificationCard = ({item}) => {
    return <>
     <div className="flex flex-row justify-start items-center p-1-5 my-3 cursor-pointer" style={{boxShadow:"0px 0px 6px 2px #e6e0e0", borderRadius: 10}}>
        <img style={{margin: 5, borderRadius: 10, maxWidth: 72, maxHeight: 72}} src={item.image_url}/>
        <div className="flex flex-row justify-between" >
            <div className="flex flex-col justiy-between ml-2">
                <div style={{fontSize: 14, fontWeight: 600}}>{item.title}</div>
                <div style={{fontSize: 10, maxWidth: 165}}>{item.description}</div>
                <div>{item.subtitle}</div>
            </div>
            <div className="flex flex-col justify-between items-center my-3-5 ml-3-5">
                <div style={{fontSize: 7}}>{formatAddTime(item.date_add)}</div>
                <img style={{maxWidth: 26, maxHeight: 26}} src={item.image_url_secondary}/>
            </div>
        </div>
     </div>
    </>
}

export default NotificationCard;