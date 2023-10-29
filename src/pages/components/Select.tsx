import React, { useEffect, useState } from "react";


const Select = ({ selected, onChange, options }) => {
    const [showItems, setShowItems] = useState(false);

    return <div style={{ width: "92%" }}  >
        <div className="custom-select" onClick={() => setShowItems(!showItems)}>
            <div className={!showItems ? "select-selected" : "select-selected select-arrow-active"} >
                {options[selected].img && <img style={{ marginRight: "20px", height: "25px" }} src={options[selected].img} />}
                {options[selected].label}
            </div>
            {showItems && <div className="select-items">
                {options.map((item, index) => {
                    return <div key={index} className={index == selected ? "same-as-selected" : ""} onClick={() => onChange(index)}>
                        {item.img && <img style={{ marginRight: "20px", height: "25px" }} src={item.img} />}
                        <div >{item.label}</div>
                    </div>
                })}
            </div>}
        </div>
    </div>
}

export default Select