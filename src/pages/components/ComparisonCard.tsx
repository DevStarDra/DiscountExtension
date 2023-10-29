import React from "react"
import { getURL } from "../../core/common"

const ComparisonCard = ({ item }) => {  
    const formatTimeStamp = (timestamp) => {
        if (!timestamp) return '';
        let delta_s = (Date.now()/1000 - timestamp);
        if(delta_s > 60*60*24*365) return `Updated ${Math.round(delta_s / 3600 / 24 / 365)} year${delta_s/(60*60*24*365) >= 2 ? 's' :''} ago`;
        if(delta_s > 60*60*24*30) return `Updated ${Math.round(delta_s / 3600 / 24 / 30)} month${delta_s/(60*60*24*30) >=2 ? 's':''} ago`;
        if (delta_s > 60 * 60 * 24) return `Updated ${Math.round(delta_s / 3600 / 24)} day${delta_s/(60*60*24) >=2 ? 's':''} ago`;
        if (delta_s > 60 * 60) return `Updated ${Math.round(delta_s / 3600)} hour${delta_s/(60*60) >=2 ?'s':''} ago`;
        if (delta_s > 60) return `Updated ${Math.round(delta_s / 60)} minute${delta_s/60 >=2 ? 's':''} ago`;
        return `Updated ${Math.round(delta_s)} second${delta_s >=2 ?'s':''} ago`;
    }

    const onClickItem = () => {
        window.open(item.direct_link, "_blank", 'noopener,noreferrer');
    }
    return <div className="comparison-card" onClick={()=> onClickItem()}>
        <div className="">
            <img style={{ position: "absolute", top: "23px" }} src={item.store_logo} />
            <div className="absolute" style={{ fontSize: "10px", left: "3px", bottom: "2px" }}>{formatTimeStamp(item.timestamp_updated)}</div>
        </div>
        <div className="flex flex-row justify-between items-center">
            <div className="text-right text-sm text-bold">
                <div style={{ fontSize: "10px", color: '#808080' }}>{item.condition}</div>
                <div style={{ fontWeight: "bold", marginTop: 2, marginBottom:2 }}>{`${item.currency} ${item.price}`}</div>
                <div style={{ fontSize: "10px", color: '#808080' }}>{item.comment}</div>
            </div>
            <img style={{ width: "8px", height: "15px", paddingLeft: "12px" }} src={getURL("assets/logos/iconGTGreen.png")} />
        </div>
    </div>
}

export default ComparisonCard