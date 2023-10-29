import { getURL } from "./common";
export const ISDEV = false;
export const constant = {
  URL_UNISTALL: "https://discount.ro/dezinstalare/?browser=chrome",
  URL_REDIRECT_AFTER_INSTALL:
    "https://discount.ro/chrome-extension-onboarding/",
  ACTIVE_DOMAINS_LIFETIME: 1000 * 60 * 60 * 24,
  URL_GET_ACTIVE_DOMAINS: "https://api.discount.ro/json/all_stores.json",
  URL_GET_DETAIL_ACTIVE_DOMAINS:
    "https://api.discount.ro/json/all_stores_with_path.json",
};
export const CouponApplyOverlayWidget = "discount-coupon-overlay-widget";
export const IndexedDbName = "extension-discount.db";
export const IndexedDbStoreLanguage = "language";
export const BUTTON_TOP = 150;

export const global = {
  domainInfos: {
    activeDomains: {
      loaded: 0,
      list: [],
    },
    detailDomains: {
      loaded: 0,
      list: [],
    },
  },
};

export const CurrencyData = {
  eur: "\u20AC",
  ron: "Lei",
  usd: "$",
};

export const TransactionTypes = [
  {
    value: "all",
    label: "All",
    color: null,
  },
  {
    value: "pending",
    label: "Pending",
    color: "#C8BA43",
  },
  {
    value: "accepted",
    label: "Accepted",
    color: "#1F66A7",
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "#C10808",
  },
];
export const pageData = [
  {
    header: "Discount.ro",
    imgUrl: getURL("assets/logos/homeIcon.svg"),
    key: "home",
  },
  {
    header: "Comparator produse",
    imgUrl: getURL("assets/logos/couponIcon.svg"),
    key: "coupon",
  },
  {
    header: "Cupoane pentru answear.ro",
    imgUrl: getURL("assets/logos/comparisonIcon.svg"),
    key: "comparison",
  },
  {
    header: "Contul tau",
    imgUrl: getURL("assets/logos/notificationIcon.svg"),
    key: "notification",
  },
];

export const assetsConstant = {
  LOGO: {
    MOBILE: getURL("assets/logos/logo-mobile.png"),
    CLOSE: getURL("assets/logos/iconClose.svg"),
  },
};

export const classNameConstant = {
  shadowRoot: "discount-ro-root",
  comparisonRoot: "comparison-root",
  cartRoot: "cart-root",
};

export const actionCode = {
  setShadowRootId: 1,
  getShadowRootId: 2,
  getDomainInfo: 4,
  setStores: 5,
  getStores: 6,
  setFeature: 7,
  getFeature: 8,
  setLanguage: 9,
  getLanguage: 10,
};

export const firebaseConfig = {
  apiKey: "AIzaSyDG_sf2bnRZdcxBOumpTcN1OT9aADfoMoY",
  authDomain: "discount-646d6.firebaseapp.com",
  projectId: "discount-646d6",
  storageBucket: "discount-646d6.appspot.com",
  messagingSenderId: "961694167011",
  appId: "1:961694167011:web:4821329e3f6a9209103ad6",
  measurementId: "G-7RWEG0QETC",
};

export const RouterConfig = {
  HOME: "home",
  USER: "user",
  COUPON: "coupon",
  COMPARISON: "comparison",
  NOTIFICATION: "notification",
  PERSONAL_INFO: "personal_info",
  WALLET: "wallet_cash",
  TRANSACTION: "transaction",
  ORDER_DETAIL: "order_detail",
};
