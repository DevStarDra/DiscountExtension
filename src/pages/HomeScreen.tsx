import React, { useEffect, useState } from "react";
import {
  CouponCardCarousel,
  OfferCardCarousel,
  SearchComponent,
  StoreCarousel,
} from "./components/components";
import { NotificationManager } from "react-notifications";
import { useAuth } from "../store/use-auth";
import { useMemoryRouter } from "../store/memory-router";
import { RouterConfig } from "../core/helper";
import { useMultiLanguage } from "../store/multi-language";
import FavoriteEditComponent from "./components/FavoriteEditComponent";
import { clearIndexedDbPersistence } from "firebase/firestore";
import {
  copyTextToClipboard,
  formatTitleFromDomain,
  getURL,
  onClickCopyCode,
} from "../core/common";
import Empty from "./components/EmptyCard";

const HomeScreen = () => {
  const [isVisibleFavoriteComponent, setIsVisibleFavoriteComponent] =
    useState(false);
  const auth = useAuth();
  const memoryRouter = useMemoryRouter();
  const language = useMultiLanguage();

  const StoreAndCoupon = ({ addStoreCallback }) => {
    const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
    const [favStoreCouponList, setFavStoreCouponList] = useState([]);

    useEffect(() => {
      if(!(auth.user && auth.user.favorite_stores && auth.user.favorite_stores.length > 0)) return ;
      let select_fav_store = memoryRouter.stores.filter(
        (element) =>
          element.domain ==
          auth.user.favorite_stores[selectedStoreIndex].storeName
      );
      if (select_fav_store.length == 0) {
        setFavStoreCouponList([]);
        return;
      }
      select_fav_store = select_fav_store[0];
      let couponList = [];
      if (
        select_fav_store &&
        select_fav_store.coupons &&
        select_fav_store.coupons[auth.user.country ? auth.user.country : "ro"]
      ) {
        select_fav_store.coupons[
          auth.user.country ? auth.user.country : "ro"
        ].coupon_list.map((element, index) => {
          couponList.push({
            code: element.code,
            logo: select_fav_store.logo_url,
            title: formatTitleFromDomain(select_fav_store.domain),
            detail: element.offer_name,
            timestamp: element.date_add_timestamp,
          });
        });
      }
      setFavStoreCouponList(couponList);
    }, [, selectedStoreIndex]);

    return (
      <div className="home-segment">
        <div className="text-header-1">
          {language.get("your_stores_coupon")}
        </div>
        <StoreCarousel
          selected={selectedStoreIndex}
          setSelectedItem={setSelectedStoreIndex}
          datum={
            auth && auth.user && auth.user.favorite_stores
              ? auth.user.favorite_stores
              : []
          }
          addStore={addStoreCallback}
        />
        <CouponCardCarousel
          datum={favStoreCouponList}
          onClick={onClickCopyCode}
        />
      </div>
    );
  };

  const CouponAndDeals = () => {
    return (
      <div className="home-segment">
        {memoryRouter.latestCoupons.length > 0 && (
          <>
            <div className="text-header-1 my-2">
              {language.get("coupons_deals")}
            </div>
            {memoryRouter.latestCoupons.length > 0 ? (
              <div style={{ marginTop: "-6px" }}>
                <CouponCardCarousel
                  datum={memoryRouter.latestCoupons}
                  onClick={onClickCopyCode}
                  arrowVisible={true}
                />
              </div>
            ) : (
              <div style={{ width: 150 }}>
                <Empty message={"No Data"} />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const OfferList = () => {
    return (
      <>
        {memoryRouter.feature && memoryRouter.feature.length > 0 && (
          <div className="home-segment">
            <div className="text-header-1 mt-2">
              {language.get("too_hot_to_miss")}
            </div>
            {memoryRouter.feature && memoryRouter.feature.length > 0 ? (
              <OfferCardCarousel datum={memoryRouter.feature} />
            ) : (
              <div style={{ width: 150 }}>
                <Empty message={"No Data"} />
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-full mx-3">
      {/* <SearchComponent placeholder={language.get('search_items')} search={""} onChange={() => { }} /> */}
      <div className="" style={{height: 20}}/>
      <div id="sidebar-content-inner">
        {auth.user && (
          <StoreAndCoupon
            addStoreCallback={() => {
              setIsVisibleFavoriteComponent(true);
            }}
          />
        )}
        <OfferList />
        <CouponAndDeals />
      </div>
      {isVisibleFavoriteComponent && (
        <FavoriteEditComponent
          isVisible={isVisibleFavoriteComponent}
          setIsVisible={setIsVisibleFavoriteComponent}
        />
      )}
    </div>
  );
};
export default HomeScreen;
