import React, { useEffect, useState } from "react";

import { getURL, onClickCopyCode } from "../core/common";
import CouponHeader from "./components/CouponHeader";
import CountryCarousel from "./components/CountryCarousel";
import CouponCard2 from "./components/CouponCard2";
import { useMemoryRouter } from "../store/memory-router";
import { NotificationManager } from "react-notifications";
import { RouterConfig } from "../core/helper";
import { useAuth } from "../store/use-auth";
import Empty from "./components/EmptyCard";
import EmptyPage from "./components/EmptyPage";

const CouponScreen = () => {
  const [couponHeaderType, setCouponHeaderType] = useState("coupon");
  const [counterHeader, setCounterHeader] = useState({ coupon: 0, offer: 0 });
  const [couponCountry, setCouponCountry] = useState("ro");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [couponList, setCouponList] = useState([]);
  const memoryRouter = useMemoryRouter();
  const auth = useAuth();

  useEffect(() => {
    const storeInfo = memoryRouter.storeInfo; 
    if (couponHeaderType == "coupon") {
      if (storeInfo && storeInfo.coupons && storeInfo.coupons[couponCountry]) {
        setCouponList(storeInfo.coupons[couponCountry].coupon_list);
      } else {
        setCouponList([]);
      }
    } else if (couponHeaderType == "offer") {
      if (
        storeInfo &&
        storeInfo.similar_offers &&
        storeInfo.similar_offers[couponCountry]
      ) {
        setCouponList(storeInfo.similar_offers[couponCountry].offer_list);
      } else { 
        setCouponList([]);
      }
    }
    if (storeInfo)
      setCounterHeader({
        coupon: storeInfo.coupon_count ? storeInfo.coupon_count : 0,
        offer: storeInfo.similar_offers_count
          ? storeInfo.similar_offers_count
          : 0,
      }); 
  }, [memoryRouter.store, couponCountry, couponHeaderType]);

  useEffect(() => {
    if (auth.user) {
      setCouponCountry(auth.user.country ? auth.user.country : "ro");
    }
  }, [auth.user]);

  const handleCopyCoupon = (code) => {
    onClickCopyCode(code);
    setSelectedCoupon(code);
  };

  return (
    <div className="h-full mx-3">
      <CouponHeader
        type={couponHeaderType}
        setType={setCouponHeaderType}
        counter={counterHeader}
      />
      {memoryRouter.couponCountryList.length > 1 ? (
        <CountryCarousel
          datum={memoryRouter.couponCountryList}
          selectedItem={couponCountry}
          setSelectedItem={setCouponCountry}
        />
      ) : (
        <div style={{ height: 20 }} />
      )}
      {/* <div className="coupon-country-selector">Romania</div> */}
      {memoryRouter &&
        (couponList.length > 0 ? (
          <div
            className="coupon-list scrollable flex flex-col"
            style={{
              marginTop: "-10px",
              height: memoryRouter.couponCountryList.length <= 1 && "566px",
            }}
          >
            {couponList.map((item, index) => {
              return (
                <div key={index} className="my-4 mx-1">
                  <CouponCard2
                    key={index}
                    item={item}
                    selected={selectedCoupon}
                    setSelect={handleCopyCoupon}
                    type={couponHeaderType}
                  />
                </div>
              );
            })}
          </div>
        ) : (couponHeaderType == "coupon" ? (
          <div
            className="flex justify-center items-center"
            style={{ height: 500 }}
          >
            <EmptyPage
              icon={getURL("assets/logos/iconCouponEmag.svg")}
              message={"No coupons where found"}
            />
          </div>
        ) : (
          <div
            className="flex justify-center items-center"
            style={{ height: 500 }}
          >
            <EmptyPage
              icon={getURL("assets/logos/iconBell.svg")}
              message={"No similar offers available"}
            />
          </div>
        )))}
    </div>
  );
};

export default CouponScreen;
