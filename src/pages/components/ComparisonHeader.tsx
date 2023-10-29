import React from "react"
import { getURL } from "../../core/common"
import { useMultiLanguage } from "../../store/multi-language"


const ComparisonHeader = ({ type, setType, counter }) => {
    const language = useMultiLanguage()
    return <div className="flex items-center" style={{ height: "65px" }}>
        <div className="coupon-select-type" onClick={() => { type == "compare" ? setType("similar_product") : setType("compare") }}>
            <div className={type == "compare" ? "coupon-item-selected" : "coupon-item"}>
                <img className="pt-1" src={getURL("assets/logos/iconCompare.svg")} />
                {counter && counter.compare > 0 && <div className="coupon-count">{counter.compare}</div>}
                <div className="text-md pl-2 pt-1">{language.get('compare')}</div>
            </div>
            <div className={type == "similar_product" ? "coupon-item-selected" : "coupon-item"}>
                <img className="pt-0" src={getURL("assets/logos/iconSimilar.svg")} />
                {counter && counter.similar > 0 && <div className="coupon-count">{counter.similar}</div>}
                <div className="text-md pl-1 pt-1">{language.get('similar_products')}</div>
            </div>
        </div>
    </div >
}

export default ComparisonHeader