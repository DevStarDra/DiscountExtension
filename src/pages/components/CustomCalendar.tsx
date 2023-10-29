import React, { useState } from "react";
import Calendar from "react-calendar"
const CustomCalendar = ({ value, onChange }) => {
    const [showCalendar, setShowCalendar] = useState(false)

    return <div style={{ width: "92%" }}>
        <div className="custom-calendar">
            <div
                className="select-selected"
                onClick={() => setShowCalendar(!showCalendar)}>
                {value.toDateString()}
            </div>
            {showCalendar &&
                <Calendar
                    value={value}
                    onChange={(v) => { setShowCalendar(false); onChange(v) }}
                    showNeighboringMonth={false}
                />}
        </div>
    </div>
}

export default CustomCalendar