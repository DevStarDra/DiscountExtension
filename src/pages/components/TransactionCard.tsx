import React from "react";
import { getURL } from "../../core/common";
import moment from 'moment'
import { useMemoryRouter } from "../../store/memory-router";
import { CurrencyData, RouterConfig, TransactionTypes } from "../../core/helper";

const TransactionCard = ({item}) => {  
    const router = useMemoryRouter()
    return  <div className="transaction-card" onClick={()=>router.addPage(RouterConfig.ORDER_DETAIL, item)}>
    <div className="flex flex-row">
      <div style={{width: 44, height: 44, borderRadius: 10, boxShadow: "1 2 3 -1 #070707a8"}} className="flex justify-center items-center">
        <img
          width={"31px"}
          src={item.store_logo}
        />
      </div>
      <div className="flex flex-col ml-2">
        <div style={{fontSize: 15, fontWeight: 'bold'}}>{item.store_name}</div>
        <div style={{fontSize: 9, paddingTop: 5, color: '#808080'}}>{moment(item.order_date_timestamp.seconds*1000).format("MMM D, YYYY | h:m:s A")}</div>
      </div>
    </div>
    <div className="flex flex-col"> 
          <div style={{fontSize: 15, color: "#CC2A36", fontWeight: 'bold'}}>{`${CurrencyData[item.currency]} ${item.cashback_value}`}</div>
          <div className="flex flex-row pt-2 justify-center items-center" >
             <div style={{width:5, height:5 , backgroundColor: TransactionTypes.filter(e=>e.value==item.current_status)[0].color, borderRadius:'50%'}}/>
              <div className="mr-2 ml-1" style={{fontSize: 10}} >{TransactionTypes.filter(e=>e.value==item.current_status)[0].label}</div>
          </div>
    </div>
  </div>
}

export default TransactionCard