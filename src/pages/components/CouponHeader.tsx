import React from "react"
import { getURL } from "../../core/common"
import { useMultiLanguage } from "../../store/multi-language"


const CouponHeader = ({ type, setType, counter }) => {
    const language = useMultiLanguage()
    return <div className="flex items-center" style={{ height: "65px" }}>
        <div className="coupon-select-type" onClick={() => { type == "coupon" ? setType("offer") : setType("coupon") }}>
            <div className={type == "coupon" ? "coupon-item-selected" : "coupon-item"} style={{ position: "relative" }}>
                <img className="pt-1 " src={getURL("assets/logos/iconCouponEmag.svg")} />
                {counter && counter.coupon > 0 && <div className="coupon-count">{counter.coupon}</div>}
                <div className="text-md pl-2 pt-1">{language.get('coupons')}</div>
            </div>
            <div className={type == "offer" ? "coupon-item-selected" : "coupon-item"} style={{ position: "relative" }}>
                <img className="pt-0" src={getURL("assets/logos/iconBell.svg")} />
                {counter && counter.offer > 0 && <div className="coupon-count">{counter.offer}</div>}
                <div className="text-md  pt-1 pl-1">{language.get('similar_offers')}</div>
            </div>
        </div>
    </div>
}

export default CouponHeader