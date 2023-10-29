import React, { useEffect, useState } from "react";

const SelectorItem = ({ value, selected, onSelect, opacity = 1 }) => {
    return <div className={`${value == selected ? 'text-base' : 'text-base'} bold text-center py-2`}
        style={{ cursor: 'pointer', opacity: opacity }}
        onClick={() => onSelect()}
    >
        {value}
    </div >
}

const RightSelector = ({ values, selected, setSelected, viewScopeRange, viewStoreRange }) => {
    const [ref, setRef] = useState(null) 
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(7)
    useEffect(()=>{
        if(ref){ 
            ref.scrollTo({left:0, top: 40/2*(startIndex+ endIndex-7), behavior: 'smooth'})
        }
    }, [ref, startIndex, endIndex])
    useEffect(()=>{ 
        setStartIndex(values.lastIndexOf(viewStoreRange[0]))
        setEndIndex(values.lastIndexOf(viewStoreRange[viewStoreRange.length - 1]))
    }, [viewStoreRange]) 

    const calcOpacity = (item) => {
        if(viewStoreRange.includes(item)) return 1;
        if(viewScopeRange.includes(item)) return 0.5;
        return 0.1;
    }

    return <div style={{
        width: 48, height: '100%',
        backgroundColor: "white",
        borderRadius: 12,
        border: "1px solid #eee",
        boxShadow: "rgb(226 226 226 / 60 %) 0 7px 10px - 5px"
    }}>
        <div ref={ref=>setRef(ref)} className="scrollable h-full">
            {values.map((item, index) => {
                return <SelectorItem opacity={calcOpacity(item)} key={index} value={item} selected={selected} onSelect={() => setSelected(item)} />
            })}
        </div>

    </div>
}

export default RightSelector

