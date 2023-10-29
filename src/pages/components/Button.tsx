import React from 'react'

const Button = ({ onSubmit, text, loading, className = "", style = {}, isBlue = true, disabled = false }) => {
    return (
        <button className={className} style={style} onClick={onSubmit} disabled={disabled}>
            {!loading ? text : <div className={isBlue ? "loader" : "loader-red"} />}
        </button>
    )
}

export default Button