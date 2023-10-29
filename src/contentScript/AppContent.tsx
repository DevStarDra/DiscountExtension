import React, { useEffect } from "react";
import { useState } from "react";
import {
  actionCode,
  assetsConstant,
  classNameConstant,
  CouponApplyOverlayWidget,
  ISDEV,
  pageData,
  RouterConfig,
} from "../core/helper";
import {
  formatTitleFromDomain,
  generateShadowRootId,
  getURL,
} from "../core/common";
import {
  DraggableComponent,
  Footer,
  Header,
} from "../pages/components/components";
import Popup from "../pages/Popup";
import SignIn from "../pages/SignIn";
import Language from "../models/language";
import { AuthDrawer } from "../pages/components/Drawers";
import { ProvideAuth, useAuth } from "../store/use-auth";
import AccountPage from "../pages/Acccount";
import HomeScreen from "../pages/HomeScreen";
import CouponScreen from "../pages/CouponScreen";
import ComparisonScreen from "../pages/ComparisonScreen";
import { ProvideMemoryRouter, useMemoryRouter } from "../store/memory-router";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import PersonalInfoScreen from "./../pages/PersonalInfoScreen";
import { useMultiLanguage } from "./../store/multi-language";
import { render } from "react-dom";
import { global } from "../core/helper";
import ChromeAPI from "../API/chromeAPI";
import { createRoot } from "react-dom/client";
import $ from "jquery";
import WalletScreen from "../pages/WalletScreen"; 
import TransactionScreen from "../pages/TransactionScreen";
import OrderDetailScreen from "../pages/OrderDetailScreen";
import NotificationScreen from "../pages/NotificationScreen"; 
import { getCookie, setCookie } from "../core/couponApplyFunctions";  
import { continueCouponWithRefresh, sendData, startAutoCouponApply } from "../core/oldCouponApply";

var isApplied = 0;

export default function AppContent() {
  const [showContent, setShowContent] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [selectedFooterItem, setSelectedFooterItem] = useState(0);
  const [showSignInDrawer, setShowSignInDrawer] = useState(false);
  const language = useMultiLanguage();
  const memoryRouter = useMemoryRouter();
  const auth = useAuth(); 

  useEffect(()=>{ 
    sendDataToOverlay();
  }, [language, memoryRouter])
  const sendDataToOverlay = () => { 
    if(!memoryRouter.storeInfo) return;
    const rules = memoryRouter.storeInfo.auto_apply_coupon_rules;  
    const _translation = { 
          testing_coupon:language.get('testing_coupon'),
          from : language.get('from'),
          waiting : language.get('waiting'),
          coupon_message_1 : language.get('coupon_message_1'),
          coupon_message_2 : language.get('coupon_message_2'),
          no_discount_coupon_code : language.get('no_discount_coupon_code'),
          continue_shopping:language.get("continue_shopping"),
          you_saved:language.get('you_saved'),
          apply_code:language.get('apply_code'),
          original_basket:language.get('original_basket'),
          reduce_basket:language.get('reduce_basket'),
          help_us_get_more_discount:language.get('help_us_get_more_discount'),
          add_review:language.get('add_review')
        }
    let coupon_list = [];
    if(memoryRouter.storeInfo && memoryRouter.storeInfo.coupons){
      Object.keys(memoryRouter.storeInfo.coupons).map((e, index)=>{
        coupon_list.push(...memoryRouter.storeInfo.coupons[e].coupon_list);
      })
    }
    sendData(rules, coupon_list, _translation);
  }

  useEffect(() => { 
    if (!memoryRouter.stores || memoryRouter.stores.length == 0) {
      memoryRouter.setLatestCoupons([]);
      return;
    }
    let totalCoupons = [];
    memoryRouter.stores.map((store, index) => {
      if (
        store.coupons &&
        store.coupons[language.locale] &&
        store.coupons[language.locale].coupon_list
      ) {
        store.coupons[language.locale].coupon_list.map((coupon, index) => {
          if (1 || coupon.date_add_timestamp)
            totalCoupons.push({
              code: coupon.code,
              logo: store.logo_url,
              title: formatTitleFromDomain(store.domain),
              detail: coupon.offer_name,
              timestamp: coupon.date_add_timestamp
                ? coupon.date_add_timestamp
                : 0,
            });
        });
      }
    });
    totalCoupons.sort((a, b) => b.timestamp - a.timestamp);
    memoryRouter.setLatestCoupons(totalCoupons.slice(0, 25)); 
  }, [memoryRouter.stores, language.locale]);

  useEffect(() => { 
    if (memoryRouter.storeInfo) setShowContent(true);
  }, [memoryRouter.storeInfo]);

  const ComparisonWrapper = () => {

    const onClickWrapper = () => { 
      setShowContent(true);
      setShowSideBar(true); 
      memoryRouter.addPage(RouterConfig.COMPARISON);
    };
    return (
      <>
        <link
          rel="stylesheet"
          type="text/css"
          href={getURL("assets/css/pageWidgetWrapper.css")}
        />
        <div id="onPageWidgetWrapper" onClick={() => onClickWrapper()}>
          <div id="see-offers" className="p10">
            <img src={getURL("assets/logos/logo-48.png")} />
            <div>
              <span className="seetxt">{language.get('visit')}</span>
              {`${memoryRouter.product.seller_count} ${language.get('offers_for_this_products')}.`}
            </div>
          </div>
        </div>
      </>
    );
  };

  const injectComparisonWrapper = () => {
    if ($(`.${classNameConstant.comparisonRoot}`).length > 0)
      $(`.${classNameConstant.comparisonRoot}`).remove();

    const contentRoot = document.createElement("div");
    contentRoot.id = generateShadowRootId(10);
    contentRoot.className = classNameConstant.comparisonRoot;
    const shadowRoot = contentRoot.attachShadow({ mode: "open" });
    const shadowWrapper = document.createElement("div");
    shadowWrapper.id = "root";
    if (ISDEV) document.body.append(contentRoot);
    else {
      if (
        memoryRouter.storeInfo &&
        memoryRouter.storeInfo.inject_wrappers &&
        memoryRouter.storeInfo.inject_wrappers.product_comparison_wrapper
      )
        $(
          memoryRouter.storeInfo.inject_wrappers.product_comparison_wrapper
        ).append(contentRoot);
    }
    shadowRoot.append(shadowWrapper);
    const root = createRoot(shadowWrapper);
    if (ISDEV) {
      localStorage.setItem("comparisonRootId", contentRoot.id);
    } else {
      chrome.storage.sync.set({ comparisonRootId: contentRoot.id });
    }
    root.render(<ComparisonWrapper />);
  };

  const CartPageWrapper = () => {

    useEffect(()=>{
      // console.log("aa");
      if(memoryRouter.storeInfo){  
      const rules = memoryRouter.storeInfo.auto_apply_coupon_rules;
      if(parseInt(getCookie('is_working')) == 0){
        setCookie('is_working', 1, 5);
        return;
      }
      if(parseInt(getCookie('is_working')) == 1){
        setCookie('is_working', 0, 5);
      }
      // console.log('is working', parseInt(getCookie('is_working')));
        if ( (rules[ 'refresh_after_coupon_apply' ] == 1 || rules[ 'refresh_after_coupon_apply_removed' ] == 1 ) && parseInt( getCookie( 'aaps' ) ) == 1 && rules[ 'cupon_auto_apply' ] == 1){
          // sendDataToOverlay(); 
          // console.log('coupon with refresh 0');
          continueCouponWithRefresh();
        }
      }
    }, [memoryRouter.storeInfo])
    const onClickSeeOffers = () => {  
      setShowContent(true);
      setShowSideBar(true);
      memoryRouter.addPage(RouterConfig.COUPON);
    };
    const onClickAutoApply = () => {   
      // if(memoryRouter.storeInfo){
      //   let applier = new AutoApply(memoryRouter.storeInfo.auto_apply_coupon_rules, memoryRouter.storeInfo.coupons.ro.coupon_list);
      //   var interval = setInterval(()=>{
      //       if($(`.${CouponApplyOverlayWidget}`).length > 0){ 
      //         clearInterval(interval);
      //         applier.startAutoApply();
      //         setCookie('refresh_call', 1, 5);
      //       }else{
      //         // setCookie('refresh_call', 1, 5);
      //         addAutoCouponWidget();
      //       } 
      //   }, 500); 
      if(memoryRouter.storeInfo){ 
        startAutoCouponApply();
      }
    };
    return (
      <>
        <link
          rel="stylesheet"
          type="text/css"
          href={getURL("assets/css/cartPageWrapper.css")}
        />
        <div>
          <div id="discountroAlert">
            <div
              id="onPageWidgetWrapperCoupons"
              onClick={() => onClickSeeOffers()}
            >
              <div id="see-coupons" className="p10">
                <img src={getURL("assets/logos/logo-48.png")} />
                <div>
                  <span className="seetxt">Vezi</span>
                  <span className="bold underline">{`${
                    memoryRouter.storeInfo.coupon_count
                  } ${
                    memoryRouter.storeInfo.coupon_count > 1
                      ? "Cupoane"
                      : "Cupon"
                  }`}</span>
                </div>
              </div>
            </div>
            {memoryRouter.storeInfo.auto_apply_coupon_rules &&
              memoryRouter.storeInfo.auto_apply_coupon_rules.cupon_auto_apply &&
              memoryRouter.storeInfo.auto_apply_coupon_rules.cupon_auto_apply ==
                1 && (
                <div
                  id="discountAlertAutoAParent"
                  onClick={() => onClickAutoApply()}
                >
                  <div id="discountAlertAutoA">
                    Aplică <br />
                    Automat
                  </div>
                </div>
              )}
          </div>
        </div>
      </>
    );
  };

  const injectCartPageWrapper = () => {
    // console.log("inject cart page");
    const contentRoot = document.createElement("div");
    contentRoot.id = generateShadowRootId(10);
    contentRoot.className = classNameConstant.cartRoot;
    const shadowRoot = contentRoot.attachShadow({ mode: "open" });
    const shadowWrapper = document.createElement("div");
    shadowWrapper.id = "root";
    if (ISDEV) document.body.append(contentRoot);
    else { 
      var count = 0;
      var inject_query = memoryRouter.storeInfo.auto_apply_coupon_rules.message_available_coupons_path;
      let injectInterval = setInterval(()=>{
        if(inject_query.includes(':parent')){
          if ($(inject_query.replace(':parent', '')).parent().length > 0 ){ 
            clearInterval(injectInterval);
            
            if ($(`.${classNameConstant.cartRoot}`).length > 0)
            $(`.${classNameConstant.cartRoot}`).remove();
            $(inject_query.replace(':parent', '')).parent().append(contentRoot);
            shadowRoot.append(shadowWrapper);
            const root = createRoot(shadowWrapper);
            if (ISDEV) {
              localStorage.setItem("cartRootId", contentRoot.id);
            } else {
              chrome.storage.sync.set({ cartRootId: contentRoot.id });
            }
            root.render(<CartPageWrapper />);
            return;
          }
        }else{
          
          if ($(inject_query).length > 0 ){ 
            clearInterval(injectInterval);
            
            if ($(`.${classNameConstant.cartRoot}`).length > 0)
            $(`.${classNameConstant.cartRoot}`).remove();
            $(inject_query).append(contentRoot);
            shadowRoot.append(shadowWrapper);
            const root = createRoot(shadowWrapper);
            if (ISDEV) {
              localStorage.setItem("cartRootId", contentRoot.id);
            } else {
              chrome.storage.sync.set({ cartRootId: contentRoot.id });
            }
            root.render(<CartPageWrapper />);
            return;
          }
        }
        
        // console.log('count',count);
        count++;
        if(count == 10) clearInterval(injectInterval);
      }, 500);
    }
   
  };

  useEffect(() => {
    if (memoryRouter && memoryRouter.storeInfo) {
      // console.log(memoryRouter.storeInfo)
      if (
        memoryRouter.storeInfo.coupons &&
        memoryRouter.storeInfo.auto_apply_coupon_rules &&
        memoryRouter.storeInfo.auto_apply_coupon_rules.cart_url_contains &&
        (ISDEV ||
          window.location.href.includes(
            memoryRouter.storeInfo.auto_apply_coupon_rules.cart_url_contains
          )) &&
        memoryRouter.storeInfo.auto_apply_coupon_rules
          .message_available_coupons_path
      ) {
        // console.log('inject wrapper');
        injectCartPageWrapper();
      }
    }
    /* check inject comparison wrapper */
    if (memoryRouter && memoryRouter.product) {
      if (memoryRouter.product.seller_count) injectComparisonWrapper();
    }
    /* */
  }, [memoryRouter.storeInfo, memoryRouter.product]);

  useEffect(() => {
    if (ISDEV) {
      const _user = JSON.parse(localStorage.getItem("userInfo"));
      if (_user) auth.setUser(_user);
      else auth.setUser(false);
    } else
      chrome.storage.sync.get().then((result) => {
        if (result.userInfo) {
          auth.setUser(result.userInfo);
        } else auth.setUser(false);
      });
  }, [showSideBar]);

  useEffect(() => {
    if (auth.user && auth.user.language) language.setLocale(auth.user.language);
  }, [auth.user]);

  const routerSwitch = () => {
    return (
      <div className="w-full h-full">
        <Header
          onClose={() => setShowSideBar(false)}
          onClickUser={() => {
            setSelectedFooterItem(-1);
            memoryRouter.addPage(RouterConfig.USER);
          }}
          afterSignOut={() => {
            NotificationManager.success("signout", "", 2000);
            memoryRouter.goBackPage(true);
          }}
        />
        <Footer
          selectItem={selectedFooterItem}
          setSelectItem={setSelectedFooterItem}
        />
        <div id="sidebar-content">
          {/* {pageState == RouterConfig.HOME ?
          <HomeScreen popular_store={popular_store} offers={offers} coupons={coupons} carousel={carousel} />
          :
          pageState == RouterConfig.SIGNIN ?
            <SignInDrawer isVisible={showSignInDrawer} setIsVisible={setShowSignInDrawer} />
            : null} */}
          {memoryRouter.currentPage == RouterConfig.USER ? (
            <AuthDrawer
              isVisible={showSignInDrawer}
              setIsVisible={setShowSignInDrawer}
              content={<AccountPage />}
            />
          ) : memoryRouter.currentPage == RouterConfig.HOME ? (
            <HomeScreen/>
          ) : memoryRouter.currentPage == RouterConfig.COUPON ? (
            <CouponScreen />
          ) : memoryRouter.currentPage == RouterConfig.COMPARISON ? (
            <ComparisonScreen />
          ) : memoryRouter.currentPage == RouterConfig.NOTIFICATION ? (
            <NotificationScreen />
          ) : memoryRouter.currentPage == RouterConfig.PERSONAL_INFO ? (
            <AuthDrawer
              isVisible={showSignInDrawer}
              setIsVisible={setShowSignInDrawer}
              content={<PersonalInfoScreen />}
            />
          ) : memoryRouter.currentPage == RouterConfig.WALLET ? (
            <AuthDrawer
              isVisible={showSignInDrawer}
              setIsVisible={setShowSignInDrawer}
              content={<WalletScreen />}
            />
          ) : memoryRouter.currentPage == RouterConfig.TRANSACTION ? (
            <AuthDrawer
              isVisible={showSignInDrawer}
              setIsVisible={setShowSignInDrawer}
              content={<TransactionScreen />}
            />
          ) : memoryRouter.currentPage == RouterConfig.ORDER_DETAIL ? (
            <AuthDrawer
              isVisible={showSignInDrawer}
              setIsVisible={setShowSignInDrawer}
              content={<OrderDetailScreen />}
            />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div id="discount-app" className="">
      {showContent && (
        <>
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/sidebar.css")}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/carousel.css")}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/card.css")}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/toggle-button.css")}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/notifications.css")}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={getURL("assets/css/select.css")}
          />
          {!showSideBar ? (
            <div id="discount-widget">
              <DraggableComponent
                onClick={async () => {
                  setShowSideBar(true);
                }}
              />
            </div>
          ) : (
            <div id="discount-main-sidebar">
              <div
                title="Discount.ro"
                className="absolute cursor-pointer bg-red-1"
                onClick={() => setShowSideBar(false)}
                style={{
                  padding: "5px",
                  top: "10px",
                  height: "30px",
                  left: "-37px",
                  borderRadius: "8px 0 0 8px",
                }}
              >
                {/* <img style={{ width: "30px" }} src={assetsConstant.LOGO.CLOSE} /> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: 35,
                      color: "white",
                      paddingRight: 2,
                      paddingLeft: 2,
                    }}
                  >
                    X
                  </div>
                </div>
              </div>
              {routerSwitch()}
            </div>
          )}

          <NotificationContainer />
        </>
      )}
    </div>
  );
}
