import React, { useState, useEffect, useContext, createContext } from "react";
import { ISDEV, IndexedDbStoreLanguage, RouterConfig, actionCode } from "../core/helper";
import { Router } from "express"; import * as CryptoJS from 'crypto-js';

import User from "../models/user"
import Store from "../models/store"
import Feature from "../models/feature"
import Product from "../models/product"
import { readSync } from "fs";
import { getItem, setItem } from "../core/IndexedDB";
import ChromeAPI from "../API/chromeAPI";
const memoryRouterContext = createContext(undefined);
const countryList = [
    {
        value: "ro",
        label: "Romania"
    },
    {
        value: "international",
        label: "International"
    },
    {
        value: "it",
        label: "Italy"
    },
    {
        value: "en",
        label: "USA"
    },
]

const countryLabel = {
    ro: "Romania",
    international: "International",
    it: "Italy",
    en: "USA"
}
export function ProvideMemoryRouter({ children }) {
    const memoryRouter = useProvideMemoryRouter();
    return <memoryRouterContext.Provider value={memoryRouter}>{children}</memoryRouterContext.Provider>;
}
export const useMemoryRouter = () => {
    return useContext(memoryRouterContext);
};

function useProvideMemoryRouter() {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(RouterConfig.HOME);
    const [headerTitle, setHeaderTitle] = useState("");
    const [shadwoRootId, setShadowRootId] = useState('');
    const [stores, setStores] = useState([]);
    const [latestCoupons, setLatestCoupons] = useState([])
    const [product, setProduct] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null)
    const [feature, setFeature] = useState([])
    const [couponCountryList, setCouponCountryList] = useState([])
    const [props, setProps] = useState(null);

    const addPage = (router, props=null) => {  
        setProps(props);
        setCurrentPage(router);
    }

    const goBackPage = (check = false) => { 
        if(currentPage == RouterConfig.WALLET) setCurrentPage(RouterConfig.USER)
        else if(currentPage == RouterConfig.TRANSACTION) setCurrentPage(RouterConfig.WALLET)
        else if(currentPage == RouterConfig.ORDER_DETAIL) setCurrentPage(RouterConfig.TRANSACTION)
        else setCurrentPage(RouterConfig.USER) 
    }

    const isFirstPage = () => {
        if (history.length > 1) return false;
        return true;
    }

    useEffect(() => {
        async function getProduct(productUrl) {
            const product = await Product.getByProductUrl(productUrl);
            if (product.length > 0)
                setProduct(product[0])
            else setProduct(null)
        }
        if (ISDEV) { 
            getItem(IndexedDbStoreLanguage, 'langIso', 1, ({ state, data }) => {
                if (state && data.stores && data.stores.length > 0 && data.loadedStore && (Date.now() - data.loadedStore) < 1000 * 60 * 60 * 24) {
                    setStores(data.stores)
                } else {
                    Store._getAll().then(result => {
                        setStores(result);
                        setItem(IndexedDbStoreLanguage, 'langIso', { langIso: 1, loadedStore: Date.now(), stores: result }, () => { })
                    })
                }
            })
            /* check store info end */

            /*get feature data from storage expired time is 24 hour */
            const feature = JSON.parse(localStorage.getItem('feature'));
        
            let loadedFeature = JSON.parse(localStorage.getItem('loadedFeature'));
            if (feature && feature.length > 0 && (Date.now() - loadedFeature) < 1000 * 60 * 60 * 24) {
                setFeature(feature)
            } else {
                Feature._getAll().then(result => {
                    setFeature(result);
                    localStorage.setItem('feature', JSON.stringify(result))
                    localStorage.setItem('loadedFeature', JSON.stringify(Date.now()))
                })
            }
            /*get feature data end */

            /* get product data from hashed url */
            let url = "https://www.evomag.ro/componente-pc-gaming-carcase/aerocool-carcasa-aerocool-aero-one-frost-midtower-negru-3796370.html";
            url = url.replace(/\?.*$/, '').replace(/\/$/, '').replace(/(http?:\/\/)?(https?:\/\/)?(www\.)?/i, '');
            const hash = CryptoJS.SHA1(url).toString(); 
            getProduct(hash)
            /*end get product data */
        } else {
            /*get Shadow Root Id from storage */
            chrome.storage.sync.get().then(results => {
                if (results.shadowRootId) { 
                    setShadowRootId(results.shadowRootId)
                }
            })
            /* end */ 

            // getItem(IndexedDbStoreLanguage, 'langIso', 1, ({ state, data }) => {
            //     if (state && data.stores && data.stores.length > 0 && data.loadedStore && (Date.now() - data.loadedStore) < 1000 * 60 * 60 * 24) {
            //         setStores(data.stores)
            //     } else {
            //         Store._getAll().then(result => {
            //             setStores(result);
            //             setItem(IndexedDbStoreLanguage, 'langIso', { langIso: 1, loadedStore: Date.now(), stores: result }, () => { })
            //         })
            //     }
            // })
            // ChromeAPI.getStores((result)=>{ 
            //     if(result && result.loaded && (Date.now() - result.loaded) < 1000*60*60*24 && result.list && result.list.length > 0){
            //         console.log(result)
            //         setStores(result.list)
            //     }else{
            //         Store._getAll().then(stores=>{
            //             setStores(stores);
            //             ChromeAPI.setStores(stores);
            //         })
            //     }
            // })
            try{
                chrome.runtime.sendMessage({code: actionCode.getStores}, function(result){
            
                if(result && result.loaded && (Date.now() - result.loaded) < 1000*60*60*24 && result.list && result.list.length > 0){
                    setStores(result.list)
                }else{
                    Store._getAll().then(stores=>{ 
                        setStores(stores)
                        ChromeAPI.setStores(stores)
                    })
                }
            })}catch(err){
                // console.log(err)
            }
            /* check store info end */

            /* check feature info start */
            try{
                chrome.runtime.sendMessage({code: actionCode.getFeature}, function(result){
     
                if(result && result.loaded && result.list && result.list.length > 0){
                    setFeature(result.list)
                }else{
                    Feature._getAll().then(features=>{ 
                        setFeature(features)
                        chrome.runtime.sendMessage({code: actionCode.setFeature, feature: features})
                    })
                }
            })}catch(err){
                // console.log(err)
            }
            /* check feature info end */

            /* get product data from hashed url */
            let url = location.href;
            url = url.replace(/\?.*$/, '').replace(/\/$/, '').replace(/(http?:\/\/)?(https?:\/\/)?(www\.)?/i, '');
            const hash = CryptoJS.SHA1(url).toString();
            getProduct(hash)
            /*end get product data */
        }
    }, [])

    useEffect(() => {
        /* checkout url in stores start*/
        if (!stores || stores.length == 0) return;
        let url = location.href;
        if (ISDEV) url = "https://www.evomag.ro/componente-pc-gaming-carcase/aerocool-carcasa-aerocool-aero-one-frost-midtower-negru-3796370.html";
        let baseDomain = new URL(url).hostname.replace('www.', '')
        let filteredStore = stores.filter((element) => element.domain == baseDomain);
        if (filteredStore.length > 0 ) {
            if(filteredStore[0].auto_apply_coupon_rules)
            Object.keys(filteredStore[0].auto_apply_coupon_rules).map((e)=>{
                let str = filteredStore[0].auto_apply_coupon_rules[e];
                str = str.replace(/\&quot;/g, '"');
                str = str.replace(/\&lt;/g, '<');
                str = str.replace(/\&gt;/g, '>');
                str = str.replace(/\&amp;/g, '&');
                str = str.replace(/\&nbsp;/g, ' ');
                str = str.replace(/\&apos;/g, "'");
                filteredStore[0].auto_apply_coupon_rules[e] = str;
            })
            
            setStoreInfo(filteredStore[0]);
        } else {
            setStoreInfo(null)
        }
        /* checkout url in stores end*/
    }, [stores])

    useEffect(() => {
        /* get country list contained coupon list  */ 
        let countries = [];
        storeInfo && storeInfo.countries.map(element => {
            countries.push({ value: element, label: countryLabel[element] })
        })
        setCouponCountryList(countries)
        /* */
    }, [storeInfo])


    return {
        history,
        currentPage,
        headerTitle,
        stores,
        product,
        shadwoRootId,
        feature,
        storeInfo,
        latestCoupons,
        couponCountryList,
        props,
        setProps,
        setCouponCountryList,
        setLatestCoupons,
        setStoreInfo,
        setFeature,
        setShadowRootId,
        setProduct,
        setStores,
        setHeaderTitle,
        addPage,
        goBackPage,
        isFirstPage
    };
}