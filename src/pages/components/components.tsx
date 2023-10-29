import React, { Component, memo, useEffect } from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import { List, Input } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { pageData, assetsConstant, global, RouterConfig, ISDEV, BUTTON_TOP } from "../../core/helper";
import Slider from 'react-slick'
import { getCurrencyToDisplay, getHeaderTitle, getURL, needBackButton, saveToStorage } from "../../core/common"
import { useAuth } from "../../store/use-auth";
import { useMemoryRouter } from "../../store/memory-router";
import ChromeAPI from "../../API/chromeAPI";
import { useMultiLanguage } from "../../store/multi-language";
import { useLoadingValue } from "react-firebase-hooks/auth/dist/util";
import { ModuleFilenameHelpers } from "webpack";

export const SlickArrow = ({showPrev, showNext, onPrev, onNext}) => {
    return <>
        <div className="flex flex-row items-center">
            <div className="cursor-pointer"  onClick={()=>showPrev&&onPrev()} style={{opacity: showPrev?1:0.3, width: 28, height: 28}}><img src={getURL('assets/logos/prev_arrow.svg')}/></div>
            <div className="cursor-pointer"onClick={()=>showNext&&onNext()} style={{opacity: showNext?1:0.3, width: 28, height: 28}}><img src={getURL('assets/logos/next_arrow.svg')}/></div>
        </div>
    </>
}

export const CouponCard = ({ data, onClick }) => {
    const language = useMultiLanguage();

    const formatTimeStamp = (timestamp) => {
        if (!timestamp) return '';
        let delta_s = (Date.now() / 1000 - timestamp);
        if (delta_s > 60 * 60 * 24) return `Worked ${Math.round(delta_s / 3600 / 24)} days ago`;
        if (delta_s > 60 * 60) return `Worked ${Math.round(delta_s / 3600)} hours ago`;
        if (delta_s > 60) return `Worked ${Math.round(delta_s / 60)} minutes ago`;
        return `Worked ${Math.round(delta_s)} seconds ago`;
    }

    const formatDetail = (detail) => {
        if(detail.length >  55) return detail.slice(0, 55) + "...";
        return detail;
    }

    return <div className="coupon-card">
        <div className="flex">
            <img src={data.logo} />
            <div className="coupon-card-title"> {data.title.length > 10 ? data.title.slice(0, 10) + "..." : data.title} </div>
        </div>
        <div className="coupon-card-detail"> {formatDetail(data.detail)}</div>
        {formatTimeStamp(data.timestamp).length > 0 &&<div className="coupon-card-description"> {formatTimeStamp(data.timestamp)}</div>}
        <div className="w-full flex items-center justify-center mt-2">
            <button className="coupon-card-copy-button" onClick={() => onClick()}>{language.get('copy_coupon')}</button>
        </div>
    </div>
}

export const OfferCard = ({ data, onClick }) => {
    return <div className="offer-card" onClick={()=>onClick()}>
        <img src={data.image_url} draggable={false} />
        <div className="offer-card-title"  > {data.title}</div>
        {data.subtitle && data.subtitle.length && <div className="offer-card-description" > {data.subtitle}</div>}
    </div>
}

export const CouponCardCarousel = ({ datum, onClick, arrowVisible=false}) => {
    const [clickable, setClickable] = useState(true)
    
    const [refSlider, setRefSlider] = useState(null) 
    const [showPrev, setShowPrev] = useState(false)
    const [showNext, setShowNext] = useState(false) 
    
    useEffect(()=>{ 
        if(refSlider){ 
            if(refSlider.props.slidesToShow < datum.length) setShowNext(true)
            else setShowNext(false)
        }
    }, [refSlider])
    const settings = {
        infinite: false,
        dots: false,
        slidesToShow: 1.45,
        slidesToScroll: 1,
        arrows: false,
        // focusOnSelect: true,
        afterChange: (index)=>{ 
            if(index > 0) setShowPrev(true)
            else setShowPrev(false)
            if(index + refSlider.props.slidesToShow >= datum.length) setShowNext(false)
            else setShowNext(true)
            setClickable(true)
        },
        beforeChange: () => setClickable(false),
        responsive: [{
            breakpoint: 780,
            settings: {
                slidesToShow: 1.45,
                infinite: false,
            }

        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1.45,
                infinite: false,
            }
        }]
    };
    return <div id="coupon-list-container">
            <Slider ref={slider=>setRefSlider(slider)} {...settings}>
                {datum.map((item, index) => {
                    return <CouponCard key={index} data={item} onClick={() => clickable && onClick(item.code)} />
                })}
            </Slider>
            {arrowVisible &&<div className="relative" style={{left: 288, bottom: 160}}>
            <SlickArrow 
                showNext={showNext} 
                showPrev={showPrev} 
                onNext={()=>refSlider&&refSlider.slickNext()}
                onPrev={()=>refSlider&&refSlider.slickPrev()}/>
        </div>}
    </div>
}

export const OfferCardCarousel = ({ datum }) => {
    const [clickable, setClickable] = useState(true)
    const [refSlider, setRefSlider] = useState(null) 
    const [showPrev, setShowPrev] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const settings = {
        infinite: false,
        dots: false,
        slidesToShow: 2.63,
        slidesToScroll: 1,
        beforeChange: ()=>setClickable(false),
        afterChange: (index)=>{ 
            if(index > 0) setShowPrev(true)
            else setShowPrev(false)
            if(index + refSlider.props.slidesToShow >= datum.length) setShowNext(false)
            else setShowNext(true)
            setClickable(true)
        },
        arrows: false,
        responsive: [{
            breakpoint: 780,
            settings: {
                slidesToShow: 2.63,
                infinite: false,
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 2.63,
                infinite: false,
            }
        }]
    };
    const onClickOfferCard  = (item) => { 
        window.open(item.redirect_url, "_blank", 'noopener,noreferrer');
    }
    useEffect(()=>{ 
        if(refSlider){ 
            if(refSlider.props.slidesToShow < datum.length) setShowNext(true)
            else setShowNext(false)
        }
    }, [refSlider])

    return <div id="offer-list-container">
        <div className="relative" style={{left: 288, bottom: 27}}>
            <SlickArrow 
                showPrev={showPrev} 
                showNext={showNext} 
                onNext={()=>refSlider&&refSlider.slickNext()}
                onPrev={()=>refSlider&&refSlider.slickPrev()}/>
        </div>
        <div className="relative" style={{top: -25}}>
            <Slider ref={slider=>setRefSlider(slider)} {...settings}>
                {datum.map((item, index) => {
                    return <OfferCard key={index} data={item} onClick={()=> clickable && onClickOfferCard(item)} />
                })}
            </Slider>
        </div>
    </div>
}

export const DraggableComponent = ({ onClick }) => {
    const [prevPos, setPrevPos] = useState(null);
    const [totalCount, setTotalCount] = useState(0)
    const router = useMemoryRouter();
    const [topPosition, setTopPosition] = useState(0)

    useEffect(() => {
        if (ISDEV) {
            const topPos = JSON.parse(localStorage.getItem('buttonTop'))
            if (topPos)
                setTopPosition(parseInt(topPos))
            else{
                setTopPosition(BUTTON_TOP);
                localStorage.setItem("buttonTop", JSON.stringify(BUTTON_TOP));
            }
        } else {
            chrome.storage.sync.get().then(result => {
                if (result.buttonTop) {
                    setTopPosition(parseInt(result.buttonTop))
                }else{
                    setTopPosition(BUTTON_TOP);
                    chrome.storage.sync.set({'buttonTop': BUTTON_TOP});
                }
            })
        }
    }, [])

    useEffect(() => {
        let t = 0;
        if (router.product && router.product.seller_count) t += router.product.seller_count;
        if (router.storeInfo && router.storeInfo.coupon_count) t += router.storeInfo.coupon_count;
        setTotalCount(t)
    }, [router.product, router.storeInfo])

    const onDragStartListener = (e, data) => {
        setPrevPos({ x: e.clientX, y: e.clientY });
    }
    const onDragStopListener = (e, data) => {
        if (prevPos.x == e.clientX && prevPos.y == e.clientY) {
            onClick();
        } else {
            if (ISDEV) {
                const topPos = JSON.parse(localStorage.getItem('buttonTop')) ? JSON.parse(localStorage.getItem('buttonTop')) : 0
                localStorage.setItem('buttonTop', (parseInt(topPos) + e.clientY - prevPos.y).toString());
            } else {
                chrome.storage.sync.get().then(result => {
                    if (result.buttonTop) {
                        chrome.storage.sync.set({ 'buttonTop': parseInt(result.buttonTop) + e.clientY - prevPos.y })
                    } else {
                        chrome.storage.sync.set({ 'buttonTop': e.clientY - prevPos.y })
                    }
                })
            }
        }
    }
    return (
        <Draggable
            axis="y"
            onStart={onDragStartListener}
            onStop={onDragStopListener}
        >
            <div id="discount-button" style={{ top: topPosition }}>
                <div id="discount-button-hide" style={{ display: 'none' }} onClick={() => onClick()} />
                <div style={{ width: "50px", height: "50px", display: "inline-block", float: "left" }}>
                    <div style={{ padding: "5px" }}>
                        <img src={assetsConstant.LOGO.MOBILE} draggable={false} />
                    </div>
                    {totalCount && <div className="discount-offer-count">{totalCount}</div>}
                </div>
            </div>
        </Draggable>
    )
}

export const StoreCarousel = ({ datum, addStore, selected, setSelectedItem }) => {
    const [clickable, setClickable] = useState(true);
    const [refSlider, setRefSlider] = useState(null) 
    const [showPrev, setShowPrev] = useState(false)
    const [showNext, setShowNext] = useState(false) 
  
    useEffect(()=>{ 
        if(refSlider){ 
            if(refSlider.props.slidesToShow < datum.length) setShowNext(true)
            else setShowNext(false)
        }
    }, [refSlider])

    const settings = {
        infinite: false,
        dots: false,
        slidesToShow: 4.2,
        slidesToScroll: 3,
        arrows: false,
        afterChange: (index) => { 
            if(index > 0) setShowPrev(true)
            else setShowPrev(false)
            if(index + refSlider.props.slidesToShow >= datum.length) setShowNext(false)
            else setShowNext(true)
            setClickable(true)
        },
        beforeChange: () => {
            setClickable(false)
        },
        // focusOnSelect: true,
        responsive: [{ 
            breakpoint: 780,
            settings: {
                slidesToShow: 4.2,
                infinite: false,
            }

        }, {

            breakpoint: 480,
            settings: {
                slidesToShow: 4.2,
                infinite: false,
            }

        }]
    };
    return <div id="store-list-container">
        <div className="ml-10" style={{ width: 285 }}>
            <Slider ref={slider=>setRefSlider(slider)} className="store-list" {...settings} id="store_slider">
                {datum.map((item, index) => {
                    return  <img onClick={() => clickable && setSelectedItem(index)} key={index} src={item.logoUrl} className="store-image" />
                })}
            </Slider>
        </div>
        <div className="absolute" style={{cursor:'pointer', top: 1, left: "-4px", width: '50px', height: '50px' }}
            onClick={() => {
                addStore()
            }}>
            <img id="store-list-plus" src={getURL("assets/logos/iconPlus.svg")} />
        </div>
        <div className="relative" style={{left: -47, bottom: 63}}>
            <SlickArrow 
                showNext={showNext} 
                showPrev={showPrev} 
                onNext={()=>refSlider&&refSlider.slickNext()}
                onPrev={()=>refSlider&&refSlider.slickPrev()}/>
        </div>
    </div>
}


export const CustomSwiper = ({ datum, shadowComponent }) => {
    const [index, setIndex] = useState(0);
    const [prevPos, setPrevPos] = useState(null);
    const [mouseState, setMouseState] = useState("release");

    const onMouseDown = (e) => {
        setPrevPos({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
        setMouseState("down");
    }

    const onMouseUp = (e) => {
        if (mouseState == "release") return;
        const currentPos = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
        if (prevPos.x - currentPos.x > 5) {
            setIndex((index + 1) % datum.length);
        }
        else if (currentPos.x - prevPos.x > 5) {
            setIndex((index + datum.length - 1) % datum.length);
        }
        else {
            onClick();
        }
        shadowComponent.querySelector("#drag_card").style.transform = `translate(0px, 0px)`;
        shadowComponent.querySelector("#drag_card").style.opacity = 1;
        shadowComponent.querySelector("#drag_card_next").style.position = "absolute";
        shadowComponent.querySelector("#drag_card_prev").style.position = "absolute";
        shadowComponent.querySelector("#drag_card_next").style.top = 0;
        shadowComponent.querySelector("#drag_card_prev").style.top = 0;
        shadowComponent.querySelector("#drag_card_next").style.opacity = 0;
        shadowComponent.querySelector("#drag_card_prev").style.opacity = 0;
        setMouseState("release");
    }

    const onMouseMove = (e) => {
        if (mouseState == "down") {
            const currentPos = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
            const delta_x = currentPos.x - prevPos.x, delta_y = currentPos.y - prevPos.y;
            shadowComponent.querySelector("#drag_card").style.transform = `translate(${delta_x}px, ${delta_y}px)`;
            shadowComponent.querySelector("#drag_card").style.opacity = 0.8 - (delta_x * delta_x + delta_y * delta_y) * 1.0 / 28000;
            if (delta_x < 0) shadowComponent.querySelector("#drag_card_next").style.opacity = 0.2 + (delta_x * delta_x + delta_y * delta_y) * 1.0 / 28000;
            if (delta_x > 0) shadowComponent.querySelector("#drag_card_prev").style.opacity = 0.2 + (delta_x * delta_x + delta_y * delta_y) * 1.0 / 28000;
            if (delta_x > 150 || delta_x < -150 || delta_y > 50 || delta_y < -50) {
                onMouseUp(e);
            }
        }
    }

    const onClick = () => {
        window.open(datum[index].link, "_blank", 'noopener,noreferrer');
    }
    return (
        <div className="ovh" style={{ height: "280px" }}>
            <div className="swiper-card">
                <div className="h-100" style={{ cursor: "pointer" }}>
                    <a className="h-100 product-link" id="drag_card_next" style={{ position: "absolute", top: 0 }}>
                        <div >
                            <img alt={datum[(index + 1) % datum.length].title} width="350" height="204" src={datum[(index + 1) % datum.length].image} draggable={false} />
                        </div>
                        <div className="product-info">
                            <div className="small-image">
                                <img alt={datum[(index + 1) % datum.length].title} height="85" width="85" src={datum[(index + 1) % datum.length].shop_logo} draggable={false} />
                            </div>
                            <div className="promoinfo">
                                <div className="shop-name">
                                    <div className="shop-name-title">{datum[(index + 1) % datum.length].promo_type}</div>
                                </div>
                                <div className="shop-info">{datum[(index + 1) % datum.length].title}</div>
                                <div className="shop-desc">{datum[(index + 1) % datum.length].description}</div>
                            </div>
                        </div>
                    </a>
                    <a className="h-100 product-link" id="drag_card_prev" style={{ position: "absolute", top: 0 }}>
                        <div >
                            <img alt={datum[(index + datum.length - 1) % datum.length].title} width="350" height="204" src={datum[(index + datum.length - 1) % datum.length].image} draggable={false} />
                        </div>
                        <div className="product-info">
                            <div className="small-image">
                                <img alt={datum[(index + datum.length - 1) % datum.length].title} height="85" width="85" src={datum[(index + datum.length - 1) % datum.length].shop_logo} draggable={false} />
                            </div>
                            <div className="promoinfo">
                                <div className="shop-name">
                                    <div className="shop-name-title">{datum[(index + datum.length - 1) % datum.length].promo_type}</div>
                                </div>
                                <div className="shop-info">{datum[(index + datum.length - 1) % datum.length].title}</div>
                                <div className="shop-desc">{datum[(index + datum.length - 1) % datum.length].description}</div>
                            </div>
                        </div>
                    </a>
                    <a className="h-100 product-link" id="drag_card" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
                        <div >
                            <img alt={datum[index].title} width="350" height="204" src={datum[index].image} draggable={false} />
                        </div>
                        <div className="product-info">
                            <div className="small-image">
                                <img alt={datum[index].title} height="85" width="85" src={datum[index].shop_logo} draggable={false} />
                            </div>
                            <div className="promoinfo">
                                <div className="shop-name">
                                    <div className="shop-name-title">{datum[index].promo_type}</div>
                                </div>
                                <div className="shop-info">{datum[index].title}</div>
                                <div className="shop-desc">{datum[index].description}</div>
                            </div>
                        </div>
                    </a>

                </div>
                <ul className="slick-dots" >
                    {datum.map((item, k) => {
                        return <li className={index == k ? "slick-active" : ""}><button type="button" tabIndex={index == k ? 0 : -1} onClick={() => setIndex(k)} /></li>
                    })}
                </ul>
            </div>
        </div>
    );
}

export const Footer = ({ selectItem, setSelectItem }) => {
    const router = useMemoryRouter();
    const [badgeCount, setBadgeCount] = useState({ home: 0, coupon: 0, comparison: 0, notification: 0 });
    const auth = useAuth();
    useEffect(() => {
        let comparison = badgeCount.comparison;
        let coupon = badgeCount.coupon;
        let notification = badgeCount.notification;
        if (router.storeInfo) coupon = router.storeInfo.coupon_count;
        if (router.product) comparison = router.product.seller_count;
        
        if(auth.user && auth.user.notifications){
            notification = auth.user.notifications.length;
        }
        setBadgeCount({ ...badgeCount, comparison, coupon, notification })
    }, [router.storeInfo, router.product, auth.user])
 

    const memoryRouter = useMemoryRouter();
    const language = useMultiLanguage();

    return <div className="footer_wrapper_ul" id="footer">
        <div className="flex flex-row">
            {pageData.map((item, index) => {
                return index < pageData.length - 1 &&
                    <div key={index} className="bottomicon" onClick={() => router.addPage(pageData[index].key)}>
                        <img style={{ width: "21px", height: "21px" }} src={pageData[index].imgUrl} />
                        {badgeCount[item.key] > 0 && <div className="footerbaloon">{badgeCount[item.key]}</div>}
                        <div style={{ fontSize: "10px", paddingTop: "3px" }}>{language.get(item.key)}</div>
                    </div>;
            })}
        </div>
        <div key={3} className="bottomicon" style={{ marginRight: "16px" }} onClick={() => router.addPage(pageData[3].key)}>
            <img style={{ width: "21px", height: "21px" }} src={pageData[3].imgUrl} />
            {badgeCount.notification > 0 && <div className="footerbaloon">{badgeCount.notification}</div>}
            <div style={{ fontSize: "10px", paddingTop: "3px" }}>{language.get('notification')}</div>
        </div>
    </div>
}

export const Header = ({ onClose, onClickUser, afterSignOut }) => {
    const auth = useAuth();
    const router = useMemoryRouter();
    const memoryRouter = useMemoryRouter();
    const language = useMultiLanguage();
    return <div className="sidebar-content-header flex flex-row items-center mt-2 justify-between">
        {needBackButton(router.currentPage) && <div className="back-button" onClick={() => memoryRouter.goBackPage()}  >
            <div style={{ margin: "auto", width: "40%" }}>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.8418 1.32812L1.66975 6.50017L6.8418 11.6722" stroke="#28303F" strokeLinecap="round"/>
                </svg>
            </div>
            </div>}
        <div className="flex flex-row justify-between w-full">
            <div className="text-xl" style={{paddingLeft:needBackButton(router.currentPage)?0:20, fontSize: 16}}>
                {language.get(getHeaderTitle(memoryRouter.currentPage, auth))}
            </div>
            <div className="flex flex-row items-center">
                <div onClick={()=>{memoryRouter.addPage(RouterConfig.WALLET)}} 
                    className="flex flex-row items-center rounded-full cursor-pointer" 
                    style={{backgroundColor: "#F0F0F0", padding: '3px 10px', marginRight: 10}}>
                    <img style={{ marginRight: 5}} src={getURL('assets/logos/logoWallet.svg')}/>
                    <div style={{fontSize: 14, marginRight: 3}}>{getCurrencyToDisplay(auth)}</div>
                </div>
                <img src={getURL("assets/logos/userIcon.svg")} style={{ cursor: 'pointer',  marginRight: "20px", top: "14px", right: "45px" }} onClick={() => { onClickUser() }} />
            </div>
        </div>
    </div>
}

export const SearchComponent = ({ placeholder, search, onChange }) => {
    return <div className="search">
        <div className="h-full" style={{ width: "320px", marginLeft: "6px" }}>
            <input placeholder={placeholder || "Search text"}
                className="w-full h-full rounded-md indent-10 text-xs border-transparent bg-gray-200"
                value={search}
                onChange={onChange}
            />
            <img style={{ width: "20px", height: "20px" }} src={getURL("assets/logos/searchIcon.svg")}></img>
        </div>
    </div>
}

// export const OfferList = ({ datum, defaulCount, addCount }) => {
//     const [loading, setLoading] = useState(false);
//     const [showCount, setShowCount] = useState(defaulCount);

//     return (
//         <div className="ovh">
//             <h2>Oferte noi</h2>
//             <ul className="offer-list">
//                 {datum.slice(0, showCount).map((item) => {
//                     return <li>
//                         <CouponInfoCard1 itemData={item} />
//                     </li>
//                 })}
//             </ul>
//         </div>
//     );
// }