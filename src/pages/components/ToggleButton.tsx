import React from "react"

const ToggleButton = ({ check, setCheck }) => {
    return check ? <div className="toggle-container-checked" onClick={() => { setCheck(!check) }}>
        < div className="toggle-container-checked circle" ></div >
    </div >
        : <div className="toggle-container" onClick={() => { setCheck(!check) }}>
            <div className="toggle-container circle"></div>
        </div>
}

export default ToggleButton