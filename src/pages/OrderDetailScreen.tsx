import React, { useEffect, useState } from "react";
import { getURL } from "../core/common";
import { useMemoryRouter } from "../store/memory-router";
import { CurrencyData, TransactionTypes } from "../core/helper";
import moment from "moment";
import { useMultiLanguage } from "../store/multi-language";

const OrderDetailScreen = () => {
    const router = useMemoryRouter();
    const language = useMultiLanguage();
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(()=>{  
        if(router && router.props){
            setOrderInfo(router.props); 
        }else setOrderInfo(null)
    }, [router])

    return <>
    <link
        rel="stylesheet"
        type="text/css"
        href={getURL("assets/css/wallet.css")}
      />
    {orderInfo && <div className="py-2" style={{maxHeight: 640, overflowY: 'auto'}}>
        <div className="order-card">
            <div>
                <div className="flex justify-center m-8 items-center">
                    <img style={{width: 80, height: 80}} src={orderInfo.store_logo}/>
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>
                        {orderInfo.store_name}
                    </div>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>
                        {orderInfo.order_id}
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between items-center p-4 mt-4" style={{border: "1px solid #2277F6", borderRadius: 10}}>
                <div className="flex flex-row justify-content items-center" style={{backgroundColor: '#f0f0f0', padding: "4px 14px 4px 6px", borderRadius: 50}}>
                    <div style={{width:15, height:15, backgroundColor: "#1FA72D", borderRadius: '50%'}}/>
                    <div style={{fontSize: 12, paddingLeft: 5}}>{language.get('total')}</div>
                </div>
                <div className="text-2xl bold">{`${CurrencyData[orderInfo.currency]} ${orderInfo.cashback_value}`}</div>
            </div>
            <div className="mt-4 mx-1">
                <div className="flex my-4 flex-row justify-between items-center">
                    <div style={{fontSize: 12, color: '#7A7A7A'}}>{`${language.get('transaction_id')} :`}</div>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>{orderInfo.order_id}</div>
                </div>
                <div className="flex my-4 flex-row justify-between items-center">
                    <div style={{fontSize: 12, color: '#7A7A7A'}}>{language.get('order_value')}</div>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>{`${CurrencyData[orderInfo.currency]} ${orderInfo.total_order_value}`}</div>
                </div>
                <div className="flex my-4 flex-row justify-between items-center">
                    <div style={{fontSize: 12, color: '#7A7A7A'}}>{language.get('cashback_value')}</div>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>{`${CurrencyData[orderInfo.currency]} ${orderInfo.cashback_value}`}</div>
                </div>
                
                <div className="flex my-4 flex-row justify-between items-center">
                    <div style={{fontSize: 12, color: '#7A7A7A'}}>{language.get('status')}</div>
                    <div className="flex flex-row justify-between items-center">
                        <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: TransactionTypes.filter(e=> e.value===orderInfo.current_status)[0].color}}/>
                        <div style={{fontSize: 10, paddingLeft: 6}}>{TransactionTypes.filter(e=> e.value===orderInfo.current_status)[0].label}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-4 mx-3">
            <div className="mx-2">
            {orderInfo && orderInfo.statuses.map((status, index)=>{
                return  <div key={index} className="order-detail-card">
                <div className="flex flex-row mx-1 justify-between my-4">
                    <div style={{fontSize: 12, color: "#7A7A7A"}}>{language.get('change_date')}</div>
                    <div style={{fontSize: 15, fontWeight: 'bold'}}>{moment(status.change_date_timestamp.seconds*1000).format('M.DD.YYYY')}</div>
                </div>
                <div className="flex my-4 flex-row mx-1 justify-between items-center">
                    <div style={{fontSize: 12, color: '#7A7A7A'}}>{language.get('status')}</div>
                    <div className="flex flex-row justify-between items-center">
                        <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: TransactionTypes.filter(e=>e.value===status.status)[0].color}}/>
                        <div style={{fontSize: 10, paddingLeft: 6}}>{language.get(TransactionTypes.filter(e=>e.value===status.status)[0].label)}</div>
                    </div>
                </div>
            </div> 
            })} 
            </div>
        </div>
    </div>}
    </>
}

export default OrderDetailScreen