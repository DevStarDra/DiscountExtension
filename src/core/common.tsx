import { CurrencyData, ISDEV, RouterConfig, actionCode } from "./helper";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
export function generateShadowRootId(idLength) {
  const pattern =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012456789";
  var length = pattern.length;
  var result = "";
  for (var i = 0; i < idLength; i++) {
    result += pattern.charAt(Math.floor(Math.random() * length));
  }
  return result;
}

export function shad1(userId) {
  return userId + Math.floor(Math.random() * 1000000000) + 1;
}

export function startWithSpecial(str) {
  if (/^[^a-zA-Z0-9]/.test(str.charAt(0))) return true;
  return false;
}

export function startWithNumber(str) {
  if (/[0-9]/.test(str.charAt(0))) return true;
  return false;
}

export function checkValidateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
export function getURL(location) {
  // return "./" + location;
  return chrome.runtime.getURL(location);
}
export const getCurrencyToDisplay = (auth) => {
  let currency = CurrencyData.eur;
  if (auth.user && auth.user.currency && CurrencyData[auth.user.currency])
    currency = CurrencyData[auth.user.currency];
  let money = 0;
  if (
    auth.user &&
    auth.user.account_money &&
    auth.user.account_money.payable_amount
  )
    money = auth.user.account_money.payable_amount;
  return `${currency} ${money}`;
};

export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const onClickCopyCode = async (text) => {
  const result = await copyTextToClipboard(text);
  NotificationManager.success(`Copied ${text}`, "", 2000);
};

export const formatTitleFromDomain = (str) => {
  const regex = /^([0-9a-z]+)\./i;
  const match = regex.exec(str);

  if (match) {
    const result = match[1];
    return result;
  } else {
    return str;
  }
};

export const getHeaderTitle = (routerCode, auth) => {
  if (routerCode == RouterConfig.USER) return "user_account";
  if (routerCode == RouterConfig.PERSONAL_INFO) return "personal_info";
  if (routerCode == RouterConfig.WALLET) return "wallet";
  if (routerCode == RouterConfig.TRANSACTION) return "all_transactions";
  if (routerCode == RouterConfig.ORDER_DETAIL) return "order_details";
  if (routerCode == RouterConfig.HOME) return "home";
  if (routerCode == RouterConfig.COUPON) return "coupon";
  if (routerCode == RouterConfig.COMPARISON) return "comparison";
  if (routerCode == RouterConfig.NOTIFICATION) return "notification";
  if (auth.user) {
    if (auth.user.first_name) return auth.user.first_name;
    else return "";
  }
  return "hello_guest";
};

export const needBackButton = (routerCode) => {
  if (routerCode == RouterConfig.HOME) return false;
  if (routerCode == RouterConfig.COUPON) return false;
  if (routerCode == RouterConfig.COMPARISON) return false;
  if (routerCode == RouterConfig.USER) return false;
  return true;
};

export const saveToStorage = (key, value) => {
  if (ISDEV) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    chrome.storage.sync.set({ key: value });
  }
};
