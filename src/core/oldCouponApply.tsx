import { getURL } from "./common";
import { clickElement, getCookie, setCookie } from "./couponApplyFunctions";
import $ from "jquery";

var discountRoObject = {
  comparison_offers: false,
  coupons: [],
  offers: false,
  site_info: [],
}; 
var discountRoWidgetSettings = {
  button_top: 150,
  element_rules_last_update: "2000-12-12 00:00:00",
  element_rules: false,
};
var waitTime = 1000;
var bestCouponIndex = -1;
var bestCouponPrice = -1;
var discountRoCodeResults = [];
var translation = null;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

function getPriceFromString(string) {
  // console.log(string);

  /*string = string.replace(/[^0-9$.,]/g, ''); */
  string = string.replace(/[^\d.,-]/g, "");

  try {
    string = string.replace("-", "");

    if (discountRoObject["apply_coupons_info"]["decimalseparator"]) {
      if (discountRoObject["apply_coupons_info"]["thousandsseparator"] != "")
        string = string.replace(
          discountRoObject["apply_coupons_info"]["thousandsseparator"],
          ""
        );
    }

    if (discountRoObject["apply_coupons_info"]["decimalseparator"]) {
      if (discountRoObject["apply_coupons_info"]["decimalseparator"] == ",")
        string = string.replace(
          discountRoObject["apply_coupons_info"]["decimalseparator"],
          "."
        );
    }

    if (!string || typeof string == "undefined") return 0;

    var return_price = 0;
    var regex = /[+-]?\d+(\.\d+)?/g;
    try {
      return_price = string.match(regex).map(function (v) {
        return parseFloat(v);
      })[0];
    } catch (err) {
      return_price = 0;
    }

    return return_price;
  } catch (error) {}
}

function removeActiveCoupons() {
  try {
    // console.log('removing');
    var result = false;
    // if (
    //   discountRoObject["apply_coupons_info"][
    //     "refresh_after_coupon_apply_removed"
    //   ] == 1
    // )
    //   setCookie("iracr", 1, 5); // Is refresh after Coupon Removed

    // if (
    //   discountRoObject["apply_coupons_info"]["refresh_after_coupon_apply"] == 0
    // )
    //   setCookie("iraca", 0, 5); // Is refresh after Coupon Applied

    if (
      discountRoObject["apply_coupons_info"]["press_to_show_everytime"] == 1 ||
      parseInt(getCookie("acai")) == -1
    )
      clickElement(
        discountRoObject["apply_coupons_info"]["cupon_click_type"],
        discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
      );

    if (!discountRoObject["apply_coupons_info"]["cupon_remove_button_path"])
      return false;
    //check lensa.ro
    if (location.href.includes("lensa.ro/shopping/checkout")) {
      var aa = document.createElement("a");
      aa.setAttribute(
        "onClick",
        "deleteCartExtra('https://lensa.ro/shopping/cart/?delete-voucher&is_ajax=1')"
      );
      document.body.appendChild(aa);
    }
    if (
      $(discountRoObject["apply_coupons_info"]["cupon_remove_button_path"])
        .length > 0
    ) {
      // console.log($(discountRoObject["apply_coupons_info"]["cupon_remove_button_path"]))
      result = true;
      if (discountRoObject["apply_coupons_info"]["cupon_click_type_remove"])
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type_remove"],
          discountRoObject["apply_coupons_info"]["cupon_remove_button_path"]
        );
      else
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          discountRoObject["apply_coupons_info"]["cupon_remove_button_path"]
        );
    }

    if (
      discountRoObject["apply_coupons_info"][
        "coupon_remove_confirmation_click_path"
      ]
    ) {
      if (
        $(
          discountRoObject["apply_coupons_info"][
            "coupon_remove_confirmation_click_path"
          ]
        ).length > 0
      ) {
        result = true;
        setTimeout(function () {
          clickElement(
            discountRoObject["apply_coupons_info"]["cupon_click_type"],
            discountRoObject["apply_coupons_info"][
              "coupon_remove_confirmation_click_path"
            ]
          );
        }, parseInt(
          discountRoObject["apply_coupons_info"][
            "coupon_remove_confirmation_delay"
          ]
        ));
      }
    }
    return result;
  } catch (error) {}
}
// div[class^="Summary__cartSummaryInfoLastRow__"] p[class^="Summary__cartSummaryInfoValue__"]
function resetCouponApplyCookies() {
  /* Reset all the values to stop any pending processes */
  setCookie("aaps", 0, 5); // auto_apply_process_started
  setCookie("ccwr", 0, 5); // cupon_code_was_removed
  setCookie("trwd", 0, 5); // total cart without discount applied
  setCookie("acai", 0, 5); // Active Coupon Index to Apply
  setCookie("bdca", 0, 5); // Best discount code applie d
  setCookie("bdci", -1, 5); // Best Discount Coupon Index
  setCookie("bdp", 0, 5); // Best Discounted Price
  setCookie("igip", 0, 5); // is get initial price
  setCookie("ilca", 0, 5); // is last coupon apply
  setCookie("iraca", 0, 5); // Is refresh after Coupon Applied
  setCookie("iracr", 0, 5); // Is refresh after Coupon Removed
  setCookie('is_working', 1, 5);

  bestCouponIndex = -1;
  bestCouponPrice = 0;
  if (discountRoObject["apply_coupons_info"]["refresh_after_coupon_apply"] == 1)
    setCookie("iraca", 1, 5); // Is refresh after Coupon Applied

  if (
    discountRoObject["apply_coupons_info"][
      "refresh_after_coupon_apply_removed"
    ] == 1
  )
    setCookie("iracr", 1, 5); // Is refresh after Coupon Removed
}

function getTotalPrice() {
  try {
    var isValidTotal = false;
    var totalPrice = 0;

    if (
      discountRoObject["apply_coupons_info"]["coupon_cart_total_value_path"]
    ) {
      var price_element = $(
        discountRoObject["apply_coupons_info"]["coupon_cart_total_value_path"]
      ).clone(true);

      if (
        discountRoObject["apply_coupons_info"]["coupon_cart_total_decimal_path"]
      ) {
        // console.log('get total 1');
        var decimal_price = price_element
          .find(
            discountRoObject["apply_coupons_info"][
              "coupon_cart_total_decimal_path"
            ]
          )
          .text();
        price_element
          .find(
            discountRoObject["apply_coupons_info"][
              "coupon_cart_total_decimal_path"
            ]
          )
          .replaceWith("");
        totalPrice = parseFloat(
          getPriceFromString(price_element.text()) + "." + decimal_price
        );
      } else {
        // console.log('get total 2');
        totalPrice = parseFloat(
          getPriceFromString(price_element.text()).toString()
        );
      }

      // console.log( 'Total price: ' + totalPrice );
      return totalPrice;
    }
  } catch (error) {
    // console.log( error );
  }
}

function getTotalWithoutDiscount(removeAppliedCoupon, callback) {
  try {
    if (removeAppliedCoupon) {
      removeActiveCoupons();

      setTimeout(function () {
        // console.log( 'settimeout: ' + discountRoObject[ 'apply_coupons_info' ][ 'remove_wait_miliseconds' ] );
        var totalPrice = getTotalPrice();

        // console.log(totalPrice);

        if (totalPrice > 0) {
          setCookie("trwd", totalPrice, 5);
          setCookie("bdp", totalPrice, 5);
        }

        //

        if (typeof callback === "function") {
          callback();
        }
      }, parseInt(
        discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]
      ));
    } else {
      var totalPrice = getTotalPrice();

      // console.log(totalPrice);

      if (totalPrice > 0) {
        setCookie("trwd", totalPrice, 5);
        setCookie("bdp", totalPrice, 5);
      }

      if (typeof callback === "function") {
        callback();
      }
    }
  } catch (error) {}
}

function waitUntilElement(elementPath, callback) {
  var intervalTries = 0;
  var intervalCreate = setInterval(function () {
    // console.log( 'waiting for element:' + elementPath );
    //  console.log($(elementPath).length);
    if ($(elementPath).length > 0) {
      callback();
      clearInterval(intervalCreate);
      return false;
    }

    intervalTries++;

    if (intervalTries >= 20) clearInterval(intervalCreate);
  }, 500);
}

function insertCouponInInput(inputPath, code) {
  try {
    var el = $(inputPath);
    var try_coupon_input_tweaks = 1;

    if (el.length == 0) return false;

    el.focus();

    el.val(code);

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;

    nativeInputValueSetter.call(el[0], code);

    if (
      typeof discountRoObject["apply_coupons_info"][
        "try_coupon_input_tweaks"
      ] != "undefined"
    ) {
      if (
        discountRoObject["apply_coupons_info"]["try_coupon_input_tweaks"] == 0
      )
        try_coupon_input_tweaks = 0;
    }

    if (try_coupon_input_tweaks) {
      var event = document.createEvent("Event");

      event.initEvent("input", true, true);
      el[0].dispatchEvent(event);
      var inputEvent = new Event("input", { bubbles: true });
      el[0].dispatchEvent(inputEvent);

      el[0].dispatchEvent(new Event("focus"));
      el.click();
      el.focus();
      el.keyup();

      setTimeout(function () {
        var inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        el[0].dispatchEvent(inputEvent);

        var event = document.createEvent("Event");
        event.initEvent("input", true, true);
        el[0].dispatchEvent(event);
      }, 150);
    }
  } catch (error) {}
}

function afterSubmitMoveNext() {
  setTimeout(function () {
    compareTotalPrices();
    moveToTheNextCode();
  }, waitTime);
}

function tryToFixNotPresentCouponApply(el) {
  try {
    if (typeof el == "undefined") return false;

    if (el.length == 0) return false;

    var event = document.createEvent("Event");
    el.focus();

    event.initEvent("input", true, true);
    el[0].dispatchEvent(event);

    var inputEvent = new Event("input", { bubbles: true });
    el[0].dispatchEvent(inputEvent);
    el[0].dispatchEvent(new Event("focus"));
    el[0].dispatchEvent(new Event("click"));
    el.click();
    el.focus();
    el.keyup();

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true); // adding this created a magic and passes it as if keypressed
    el[0].dispatchEvent(evt);

    evt = document.createEvent("KeyboardEvent");
    evt.initEvent("keypress", false, true);
    el[0].dispatchEvent(evt);
  } catch (error) {}
}

function submitCouponCode(callback) {
  try {
    if (
      discountRoObject["apply_coupons_info"][
        "refresh_after_coupon_apply_removed"
      ] == 1
    )
      setCookie("iracr", 1, 5); // Is refresh after Coupon Removed

    if (
      discountRoObject["apply_coupons_info"]["refresh_after_coupon_apply"] == 1
    )
      setCookie("iraca", 1, 5); // Is refresh after Coupon Applied

    if (
      discountRoObject["apply_coupons_info"]["cupon_apply_type"] == "formbutton"
    ) {
      if (
        discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
      )
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
        );

      tryToFixNotPresentCouponApply(
        $(discountRoObject["apply_coupons_info"]["cupon_input_path"])
      );
      tryToFixNotPresentCouponApply(
        $(discountRoObject["apply_coupons_info"]["cupon_input_path"]).parent()
      );

      var inputElement = $(
        discountRoObject["apply_coupons_info"]["cupon_input_path"]
      );

      // console.log('CouponCode: ' + inputElement.length);
      if (inputElement.length == 0) {
        var intervalTries = 1;
        var intervalCreate = setInterval(function () {
          tryToFixNotPresentCouponApply(
            $(discountRoObject["apply_coupons_info"]["cupon_input_path"])
          );

          intervalTries++;

          if (intervalTries >= 10) clearInterval(intervalCreate);
        }, 500);

        waitUntilElement(
          discountRoObject["apply_coupons_info"]["cupon_input_path"],
          function () {
            if (
              (discountRoObject["apply_coupons_info"]["cupon_click_type"],
              inputElement.closest("form").find("button").length == 0)
            ) {
              tryToFixNotPresentCouponApply(
                $(discountRoObject["apply_coupons_info"]["cupon_input_path"])
              );
              tryToFixNotPresentCouponApply(
                $(
                  discountRoObject["apply_coupons_info"]["cupon_input_path"]
                ).parent()
              );
            }
            clickElement(
              discountRoObject["apply_coupons_info"]["cupon_click_type"],
              inputElement.closest("form").find("button")
            );
            clearInterval(intervalCreate);

            if (typeof callback == "function") callback();
          }
        );

        return false;
      } else {
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          inputElement.closest("form").find("button")
        );
      }
    } else if (
      discountRoObject["apply_coupons_info"]["cupon_apply_type"] == "button"
    ) {
      if (discountRoObject["apply_coupons_info"]["cupon_apply_path_element"]) {
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          discountRoObject["apply_coupons_info"]["cupon_apply_path_element"]
        );
      }
    } else if (
      discountRoObject["apply_coupons_info"]["cupon_apply_type"] == "form"
    ) {
      if (discountRoObject["apply_coupons_info"]["cupon_input_path"]) {
        var inputElement = $(
          discountRoObject["apply_coupons_info"]["cupon_input_path"]
        )
          .closest("form")
          .submit();
      }
    }

    //  if(discountRoObject['apply_coupons_info']['refresh_after_coupon_apply'] == 1 && getCookie())
 
    if (typeof callback == "function") 
    {
      setTimeout(()=>{
        callback();
      }, discountRoObject['apply_coupons_info']['coupon_wait_until_is_applied_after_submission'])
    }
  } catch (error) {}
}

function moveToTheNextCode() {
  if (parseInt(getCookie("aaps")) == 0) {
    return false;
  }
  try {
    var acai = parseInt(getCookie("acai"));
    var limit = discountRoObject["coupons"].length;
    // console.log('acai is ', acai, limit);

    if (acai < limit - 1) {
      setCookie("acai", acai + 1, 5);
      applyCurrentIndexCoupon();
    } else {
      var bdci = parseInt(getCookie("bdci"));
      if (bdci == -1 && bestCouponIndex > -1) bdci = bestCouponIndex;
      // console.log('bdci acai', bdci, acai);
      if (bdci == -1) {
        displayBestCoupon();
      } else {
        if (bdci == limit - 1) displayBestCoupon();
        else {
          // console.log('bdci is not last');
          if (
            discountRoObject["apply_coupons_info"]["cupon_remove_button_is_required"]== 1
          ) {
            // console.log('last coupon remove')
            removeActiveCoupons();
            setTimeout(function () {
              // console.log('last coupon remove 2  ', discountRoObject[
              //   "apply_coupons_info"
              // ]["remove_wait_miliseconds"]);
              startCouponCodeApply(
                discountRoObject["coupons"][bdci]["code"],
                false
              );
            }, discountRoObject[
              "apply_coupons_info"
            ]["remove_wait_miliseconds"]);
          } else {
            startCouponCodeApply(
              discountRoObject["coupons"][bdci]["code"],
              false
            );
          }
        }
      }

      setCookie("aaps", 0, 5);
      // console.log('reached the end: ' + discountRoObject['apply_coupons_info']['cupon_remove_button_is_required']);
      //  console.log(getCookie('bdp'));
      // console.log('bescopuon code index:' + bdci);
      // console.log(getCookie('bdci'));
    }
  } catch (error) {}
}

function compareTotalPrices() {
  try {
    var priceAfterCoupon = parseFloat(getTotalPrice().toString());
    // if(parseInt(getCookie('acai')) == 1) priceAfterCoupon = 100.5;
    // console.log( priceAfterCoupon );
    if (priceAfterCoupon <= 0) return false;
    var acai = parseInt(getCookie("acai"));
    var trwd = parseFloat(getCookie("trwd"));
    var bdp = parseFloat(getCookie("bdp"));
    // console.log("compare total", acai, bdp, priceAfterCoupon);

    if (trwd > 0) {
      var savedMoney = trwd - priceAfterCoupon;

      discountRoCodeResults.push({
        couponCode: discountRoObject["coupons"][acai]["code"],
        id_offer: discountRoObject["coupons"][acai]["id_offer"],
        savedMoney: savedMoney,
      });
    }

    //console.log('compareTotalPrices: ' + priceAfterCoupon + ' -> ' + bdp + ' -> code -> ' + discountRoObject['coupons'][acai].code);

    if (priceAfterCoupon < bdp) {
      bestCouponIndex = acai;
      bestCouponPrice = priceAfterCoupon;

      setCookie("bdp", priceAfterCoupon, 5);
      setCookie("bdci", bestCouponIndex, 5);

      //  console.log('bdp: ' + priceAfterCoupon + ' -> bdci: ' + bestCouponIndex);
    }
  } catch (error) {}
}

function startCouponCodeApplyRefresh(code, callback) {
  try {
    // console.log('ccc');
    if (
      discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
    ) {
      if (
        discountRoObject["apply_coupons_info"]["press_to_show_everytime"] ==
          1 ||
        parseInt(getCookie("acai")) == -1
      )
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
        );

      setTimeout(function () {
        waitUntilElement(
          discountRoObject["apply_coupons_info"]["cupon_input_path"],
          function () {
            insertCouponInInput(
              discountRoObject["apply_coupons_info"]["cupon_input_path"],
              code
            );
            // console.log('wait until');

            setTimeout(function () {
              submitCouponCode(callback);
            }, discountRoObject[
              "apply_coupons_info"
            ]["remove_wait_miliseconds"]);
          }
        );
      }, discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]);
    } else {
      insertCouponInInput(
        discountRoObject["apply_coupons_info"]["cupon_input_path"],
        code
      );

      setTimeout(function () {
        submitCouponCode(callback);
      }, discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]);
    }
  } catch (error) {}
}

function startCouponCodeApply(code, moveNext) {
  try {
    if (
      discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
    ) {
      if (
        discountRoObject["apply_coupons_info"]["press_to_show_everytime"] ==
          1 ||
        parseInt(getCookie("acai")) == 0
      ) {
        // if(  jQuery(discountRoObject['apply_coupons_info']['cupon_input_path']).length == 0 ||  jQuery(discountRoObject['apply_coupons_info']['cupon_input_path']).is(":hidden")  )
        clickElement(
          discountRoObject["apply_coupons_info"]["cupon_click_type"],
          discountRoObject["apply_coupons_info"]["button_press_show_code_input"]
        );
      }

      setTimeout(function () {
        waitUntilElement(
          discountRoObject["apply_coupons_info"]["cupon_input_path"],
          function () {
            insertCouponInInput(
              discountRoObject["apply_coupons_info"]["cupon_input_path"],
              code
            );

            setTimeout(function () {
              if (moveNext) {
                submitCouponCode(afterSubmitMoveNext);
              } else {
                submitCouponCode(displayBestCoupon); 
              }
            }, discountRoObject[
              "apply_coupons_info"
            ]["remove_wait_miliseconds"]);
          }
        );
      }, discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]);
    } else {
      // console.log('insert coupon code   ', code, discountRoObject["apply_coupons_info"]["cupon_input_path"]);
      insertCouponInInput(
        discountRoObject["apply_coupons_info"]["cupon_input_path"],
        code
      );
      // console.log('insert coupon code');
      debugger
      // setTimeout(function () {
        if (moveNext) {
          submitCouponCode(afterSubmitMoveNext);
        } else {
          submitCouponCode(null);
          setTimeout(()=>{
              displayBestCoupon();
          }, discountRoObject['apply_coupons_info']['coupon_wait_until_is_applied_after_miliseconds']) 
        }
      // }, discountRoObject["apply_coupons_info"]["coupon_wait_until_is_applied_after_miliseconds"]);
    }
  } catch (error) {}
}

function applySpecificCouponCode(code) {
  try {
    if (
      discountRoObject["apply_coupons_info"][
        "cupon_remove_button_is_required"
      ] == 1
    ) {
      removeActiveCoupons();

      setTimeout(function () {
        startCouponCodeApply(code, true);
      }, discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]);
    } else {
      startCouponCodeApply(code, true);
    }
  } catch (error) {}
}

function displayBestCoupon() {
  try {
    setCookie('is_working', 1, 5);
    var discount_index = parseInt(getCookie("bdci"));
    var initial_cart_total = parseFloat(getCookie("trwd")).toFixed(2);
    var best_discount_price = parseFloat(getCookie("bdp")).toFixed(2);
    var savings = parseFloat(
      (
        parseFloat(initial_cart_total) - parseFloat(best_discount_price)
      ).toFixed(2)
    );

    if ($("#displayCouponApplyOverLay").length == 0)
      $("body").append(
        `<div style="position:fixed; top:0px;  left:0; right:0; bottom:0; background-color:rgba(0, 0, 0, 0.6); z-index:2147483646" id="displayCouponApplyBackground" ></div><div style=" padding:40px; text-align:center; position:fixed; top:55px; width:590px; height:auto; left:50%; margin-left:-295px; border-radius:8px; overflow:hidden;  background-color:#fff; z-index:2147483647 " id="displayCouponApplyOverLay">
                               <a href="#" class="closediscountroOverlay" style="position: absolute;  right: 10px; top: 10px;  background-color: #eb4134; border-radius: 8px; font-size: 20px; color: #fff; width: 30px;  z-index: 10; text-align: center; font-size: 13px;  line-height: 30px;  font-size: 18px;  height: 30px;  text-decoration: none;">X</a>
                                        <img style="margin-top:50px; display:block; max-width:225px; height:auto; margin:0 auto" src="` +
          getURL("assets/images/loading.gif") +
          `" />
                                        
                                  </div>
                        `
      );
    if (discount_index > -1 && savings > 0) {
      // if coupon is found valid

      var html =
        ` <a href="#" class="closediscountroOverlay" style="position: absolute;  right: 10px; top: 10px;  background-color: #eb4134; border-radius: 8px; font-size: 20px; color: #fff; width: 30px;  z-index: 10; text-align: center; font-size: 13px;  line-height: 30px;  font-size: 18px;  height: 30px; text-decoration: none;">X</a><div id="discountroCouponFound" style="    width: 250px;  float:left; background-image:url('` +
        getURL("assets/images/confetti.gif") +
        `)">
    
          <h2 style="  text-align:left;  font-size: 20px;    line-height: 26px;" >` +
        translation.you_saved +
        `<strong style="color:#cc2a36">` +
        savings +
        discountRoObject["apply_coupons_info"]["shopcurrency"] +
        `</strong>!</h2>
          <div id="honeyContainer"></div><table id="discountrocpupontable"  border="0"     style=" font-size: 14px;  text-align: left;  width: 250px;  margin: 20px 0;">
            <tr>
                <td style="padding:0 5px !important; ">` +
        translation.apply_code +
        `<td><td  style="text-align:right;  padding:0 5px !important;   text-transform: uppercase;">🏷️ ` +
        discountRoObject["coupons"][discount_index].code +
        `</td>
            </tr>`;

      html +=
        `<tr>
                    <td style="padding:5px !important;">` +
        translation.original_basket +
        `<td><td style="text-align:right; padding:0 5px !important;">` +
        (initial_cart_total +
          discountRoObject["apply_coupons_info"]["shopcurrency"]) +
        `</td>
                </tr>
                <tr>
                    <td style="padding:0 5px !important; ">` +
        translation.reduce_basket +
        `<td><td style="text-align:right; font-weight:bold; padding:0 5px !important;">` +
        (best_discount_price +
          discountRoObject["apply_coupons_info"]["shopcurrency"]) +
        `</td>
                </tr>`;

      html +=
        `</table>
          <button id="" style="     background: none;
            border: 1px solid #ddd;
            padding: 10px !important;
            border-radius: 25px;
            margin-top: 15px;
            color: #fff;
            line-height: 25px !important;
            height: auto;
             line-height: 20px;  
            font-size: 17px;
            cursor: pointer;
            background-color: #cc2a36; " class="closediscountroOverlay">` +
        translation.continue_shopping +
        `</button>
          </div><div id="reviewDiscountChrome" style="    float: right;  width: 240px;  padding-top: 50px;  padding-left: 20px; border-left: 1px solid #eee;">
          <h2 style="    font-size: 14px;    line-height: 17px;" >` +
        translation.help_us_get_more_discount +
        `</h2>
          <a href="https://chrome.google.com/webstore/detail/discountro-cumpara-la-red/ffpibealclcjgmoghaocdlffiimoekeg" target="_blank" style="    display: inline-block; text-align:center; border: 1px solid #ddd; width:170px;  border-radius: 45px;   padding: 10px;  margin-top: 25px;">` +
        translation.add_review +
        `<img style="width:100px; display:block; margin:0 auto" src="` +
        getURL("assets/images/stars.jpg") +
        `"/></a>
      </div>`;

      $("#displayCouponApplyOverLay").html(html);
    } else {
      // if NO coupon is found valid
      var html =
        `<a href="#" class="closediscountroOverlay" style="position: absolute;  right: 10px; top: 10px;      background-color: #eb4134; border-radius: 8px; font-size: 20px;  color: #fff;  width: 30px;  z-index: 10;  text-align: center;  font-size: 13px;   line-height: 30px;  font-size: 18px;  height: 30px;  text-decoration: none;">X</a><div id="discountroCouponNotFound" style="   width: 250px;  margin: 0 auto;"><img style="  margin:0 auto;  width: 100px;    margin-bottom: 25px;  opacity: 0.7;" src="` +
        getURL("assets/images/sadface.png") +
        `"/>
            
     
          <h2 style="    font-size: 20px;    line-height: 26px;" >` +
        translation.no_discount_coupon_code +
        `</h2>
         
          <button id="" style="       background: none;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    line-height: 20px;
    color: #000;
    margin-top: 15px;
    font-size: 15px;
    cursor: pointer; " class="closediscountroOverlay">` +
        translation.continue_shopping +
        `</button>
      </div>`;
      $("#displayCouponApplyOverLay").html(html);
    }
  } catch (error) {}
}

function applyCurrentIndexCoupon() {
  try {
    if (discountRoObject["coupons"][parseInt(getCookie("acai"))]) {
      var current_coupon =
        discountRoObject["coupons"][parseInt(getCookie("acai"))];

      if ($("#overlayCurrentCoupon"))
        $("#overlayCurrentCoupon").text(parseInt(getCookie("acai")) + 1);

      if ($("#testingCurrentCoupon"))
        $("#testingCurrentCoupon span").text(
          discountRoObject["coupons"][parseInt(getCookie("acai"))].code
        );

      var percentTitle = 100 / discountRoObject["coupons"].length;
      var loading_width = percentTitle * (parseInt(getCookie("acai")) + 1);
      $("#discountOverlayInnerLoad").css("width", loading_width + "%");

      applySpecificCouponCode(current_coupon["code"]);
    }
  } catch (error) {}
}

function applyCurrentIndexRefresh() {
  try {
    if (discountRoObject["coupons"][parseInt(getCookie("acai"))]) {
      var current_coupon =
        discountRoObject["coupons"][parseInt(getCookie("acai"))];

      if ($("#overlayCurrentCoupon"))
        $("#overlayCurrentCoupon").text(parseInt(getCookie("acai")) + 1);

      if ($("#testingCurrentCoupon"))
        $("#testingCurrentCoupon span").text(
          discountRoObject["coupons"][parseInt(getCookie("acai"))].code
        );

      var percentTitle = 100 / discountRoObject["coupons"].length;
      var loading_width = percentTitle * (parseInt(getCookie("acai")) + 1);
      $("#discountOverlayInnerLoad").css("width", loading_width + "%");
      // console.log('apply current index with refresh', current_coupon);
      startCouponCodeApplyRefresh(current_coupon["code"], null);
    }
  } catch (error) {}
}

export function continueCouponWithRefresh() {
  try {

    if (
      discountRoObject["apply_coupons_info"]["cupon_auto_apply"] == 1 &&
      discountRoObject["apply_coupons_info"]["cart_url_contains"].length > 0
    )
      if (
        !location.href.includes(
          discountRoObject["apply_coupons_info"]["cart_url_contains"]
        )
      )
        return false; // the url does not match so it is not cart; 
    
    displayCouponApplyOverLayFirst(); // display the checking popup first
    // console.log('continue coupon with refresh start');
    const iraca =
      discountRoObject["apply_coupons_info"]["refresh_after_coupon_apply"];
    const iracr =
      discountRoObject["apply_coupons_info"][
        "refresh_after_coupon_apply_removed"
      ];
    const count = discountRoObject["coupons"].length;
    const acai = parseInt(getCookie("acai"));
    var bdp = parseFloat(getCookie("bdp"));
    var bdci = parseInt(getCookie("bdci"));
    // console.log('acai => ', acai);
    if (bdci == -1 && bestCouponIndex > -1) bdci = bestCouponIndex;
    if (parseInt(getCookie("ilca")) == 1) {
      setCookie("aaps", 0, 5);
      displayBestCoupon();
      return;
    }
    if (acai == count) { 
      if (bdci == count - 1 || bdci == -1) {
        setCookie("aaps", 0, 5);
        displayBestCoupon();
      } else {
        // console.log('bdci is not last ', discountRoObject['coupons'][bdci]);
        if ($("#displayCouponApplyOverLay"))
          $("#displayCouponApplyOverLay").html(
            '<img style="margin-top:50px; display:block;  max-width:225px; height:auto;  margin:0 auto" src="' +
              getURL("assets/images/loading.gif") +
              '" />'
          );
        if (!removeActiveCoupons()) {
          setTimeout(()=>{
            setCookie("ilca", 1, 5);
            startCouponCodeApplyRefresh(
              discountRoObject["coupons"][bdci]["code"],
              () => {
                setCookie("ilca", 1, 5);
              }
            );
          },discountRoObject['apply_coupons_info']['remove_wait_miliseconds']); 
        }else{
          // console.log('display best coupon')
          // displayBestCoupon();
        }
      }
      return;
    }
    if (parseInt(getCookie("igip")) == 1) {
      // console.log("get total initial price 1");
      getTotalWithoutDiscount(false, null);
      setCookie("igip", 2, 5);
    }
    if (iraca == 1) {
      // setTimeout(()=>{
        if (acai == -1) {
          // console.log("first coupon apply"); 
          setCookie("acai", 0, 5);
          applyCurrentIndexRefresh(); 
        } else {
          // console.log("acai is=>", acai);
          compareTotalPrices(); 
          if (acai < count - 1) {
            if (!removeActiveCoupons()) {
              // console.log('no remove')
              setTimeout(()=>{
                setCookie("acai", acai + 1, 5);
                applyCurrentIndexRefresh();
              }, discountRoObject['apply_coupons_info']['remove_wait_miliseconds']);
              
            }
          } else {
            setCookie("acai", acai + 1, 5);
            continueCouponWithRefresh();
          }
        }
      // }, discountRoObject['apply_coupons_info']['remove_wait_miliseconds']);
      
    } else {
    }
    // setCookie('aaps', 0, 5);
    // console.log('display overlay');
    // if (parseInt(getCookie("igip")) == 1) {
    //    console.log('getting total');
    //   setCookie("igip", 0, 5);
    //   getTotalWithoutDiscount(false, false);
    // }

    // // var iraca = parseInt(getCookie("iraca")); // Is refresh after Coupon Applied if this is 1
    // // var iracr = parseInt(getCookie("iracr")); // Is refresh after Coupon is Removed if this is 1
    // var iraca = discountRoObject['apply_coupons_info']['refresh_after_coupon_apply'];
    // var iracr = discountRoObject['apply_coupons_info']['refresh_after_coupon_apply_removed'];
    // var bdca = parseInt(getCookie("bdca")); // Best discount code applied if 1
    // var acai = parseInt(getCookie("acai")); // Active Coupon Index to Apply
    // var ilca = parseInt(getCookie("ilca")); // is last coupon apply
    // var limit = discountRoObject["coupons"].length - 1;

    // console.log( 'acai: ' + acai );
    // console.log( 'limit: ' + limit );
    // console.log( 'ilca: ' + ilca );
    // console.log( 'iraca: ' + iraca );
    // console.log( 'iracr: ' + iracr );

    // // does not work when there is only 1 coupon !!!!!!!!!!!!!!!!!!!!!!!! FIX exemplu ZONIA

    // if (ilca == 1) {
    //   displayBestCoupon();
    //   resetCouponApplyCookies();
    //   return false;
    // }

    // if (limit == 0 && acai == 0) {
    //   applyCurrentIndexRefresh();

    //   if (iraca == 1) {
    //     if (
    //       discountRoObject["apply_coupons_info"][
    //         "coupon_wait_until_is_applied_after_submission"
    //       ]
    //     )
    //       waitTime = parseInt(
    //         discountRoObject["apply_coupons_info"][
    //           "coupon_wait_until_is_applied_after_submission"
    //         ]
    //       );

    //     setTimeout(function () {
    //       compareTotalPrices();
    //       displayBestCoupon();
    //       setCookie("ilca", 1, 5);
    //     }, waitTime);
    //   }

    //   return false;
    // }

    // if (iraca == 1 && iracr == 0) {
    //   compareTotalPrices();

    //   // TEST ON LIBRIS AS THERE ARE CASES WHEN IT DOES NOT MOVE ON! BECAUSE IT DOES NOT FIND THE ACTIVE COUPON THAT GENERATES THE PAGE REFRESH;

    //   if (acai < limit) {
    //     if (
    //       discountRoObject["apply_coupons_info"][
    //         "cupon_remove_button_is_required"
    //       ] == 1
    //     ) {
    //       removeActiveCoupons();

    //       if (
    //         discountRoObject["apply_coupons_info"][
    //           "refresh_after_coupon_apply_removed"
    //         ] == 1
    //       ) {
    //         setTimeout(function () {
    //           window.location.replace(
    //             window.location.pathname +
    //               window.location.search +
    //               window.location.hash
    //           );
    //         }, 6000);
    //         return false;
    //       }
    //     }
    //   }
    // }

    // if (acai < limit) {
    //   if (
    //     discountRoObject["apply_coupons_info"][
    //       "cupon_remove_button_is_required"
    //     ] == 1
    //   ) {
    //     if (iracr == 1) {
    //       if (parseInt(getCookie("igip")) != 2) {
    //         setCookie("igip", 2, 5);
    //       } else {
    //         setCookie("acai", acai + 1, 5);
    //       }
    //     }
    //   } else {
    //     if (iraca == 1) {
    //       setCookie("acai", acai + 1, 5);
    //     }
    //   }
    // }

    // if (acai < limit) {
    //   applyCurrentIndexRefresh();
    // } else {
    //   var bdci = parseInt(getCookie("bdci"));

    //   if (bdci > -1) {
    //     if ($("#displayCouponApplyOverLay"))
    //       $("#displayCouponApplyOverLay").html(
    //         '<img style="margin-top:50px; display:block;  max-width:225px; height:auto;  margin:0 auto" src="' +
    //           getURL("assets/images/loading.gif") +
    //           '" />'
    //       );

    //     if (bdci == acai) {
    //       displayBestCoupon();
    //       setCookie("ilca", 1, 5);
    //       return false;
    //     } else {
    //       if (
    //         discountRoObject["apply_coupons_info"][
    //           "cupon_remove_button_is_required"
    //         ] == 1
    //       ) {
    //         if (iraca == 1 && ilca == 0 && iracr == 0) {
    //           setCookie("iraca", 0, 5);
    //           removeActiveCoupons();

    //           if (
    //             discountRoObject["apply_coupons_info"][
    //               "refresh_after_coupon_apply_removed"
    //             ] == 1
    //           ) {
    //             setTimeout(function () {
    //               window.location.replace(
    //                 window.location.pathname +
    //                   window.location.search +
    //                   window.location.hash
    //               );
    //             }, 3000);
    //             return false;
    //           }
    //         }
    //       }

    //       if (ilca == 0) {
    //         setCookie("ilca", 1, 5);
    //         applySpecificCouponCodeRefresh(
    //           discountRoObject["coupons"][bdci]["code"],
    //           true
    //         );
    //         return false;
    //       }
    //     }
    //   } else {
    //     displayBestCoupon();
    //   }

    //   return false;
    // }
  } catch (error) {}
}

export function sendData(rules, coupons, _translation) {
  discountRoObject["coupons"] = coupons;
  discountRoObject["apply_coupons_info"] = rules;
  translation = _translation;
}

export function startAutoCouponApply() {
  try {
    if (
      discountRoObject["apply_coupons_info"]["refresh_after_coupon_apply"] ==
        1 ||
      discountRoObject["apply_coupons_info"][
        "refresh_after_coupon_apply_removed"
      ] == 1
    ) {
      // console.log('start coupon with refresh');
      startCouponWithRefresh();
      return false;
    }
    // console.log('auto apply')
    if (
      discountRoObject["apply_coupons_info"][
        "coupon_wait_until_is_applied_after_submission"
      ]
    )
      waitTime = parseInt(
        discountRoObject["apply_coupons_info"][
          "coupon_wait_until_is_applied_after_submission"
        ]
      );

    resetCouponApplyCookies();
    displayCouponApplyOverLayFirst();
    setCookie("aaps", 1, 5);
    getTotalWithoutDiscount(true, applyCurrentIndexCoupon);
  } catch (error) {}
}

$(document).on("click", ".closediscountroOverlay", function () {
  try {
    resetCouponApplyCookies();
    $("#displayCouponApplyOverLay").remove();
    $("#displayCouponApplyBackground").remove();

    return false;
  } catch (error) {}
});

$(document).on("click", ".closeCheckoutPopup", function () {
  try {
    $("#discountApplyCoupons").remove();
    $("#discountApplyCouponsRefresh").remove();
    resetCouponApplyCookies();
    //setCookie('discclick_'+domain, 1, 15 );
    return false;
  } catch (error) {}
});

function closeCouponApplyOverLay() {
  $("#displayCouponApplyOverLay").remove();
  $("#displayCouponApplyBackground").remove();
}

function displayCouponApplyOverLayFirst() {
  try {
    closeCouponApplyOverLay();

    var discountFinishCouponText = false;
    var allCodesHtml =
      `<div id="discountCouponOverlay" class="discountCouponCodeWrapper" style="  text-transform:uppercase; border-radius:4px;  display: inline-block;  padding: 5px 15px;     white-space: nowrap;  background-color: #eee;  color: #333;  font-size: 14px;  line-height: 17px; border: 1px solid #ddd;">🏷️ ` +
      discountRoObject.coupons[0].code +
      `</div>`;

    allCodesHtml =
      `<div id="discountCouponsWrapper">` + allCodesHtml + "</div>";
    var html =
      `<div style="position:fixed; top:0px;  left:0; right:0; bottom:0; background-color:rgba(0, 0, 0, 0.6); z-index:2147483646" id="displayCouponApplyBackground" class="closediscountroOverlay"></div><div style=" padding:40px; text-align:center; position:fixed; top:55px; width:590px; height:auto; left:50%; margin-left:-295px; border-radius:8px; overflow:hidden;  background-color:#fff; z-index:2147483647 " id="displayCouponApplyOverLay"><a href="#" class="closediscountroOverlay" style="position: absolute;  right: 10px; top: 10px; background-color: #eb4134; border-radius: 8px;  font-size: 20px;  color: #fff;  width: 30px;  z-index: 10;  text-align: center;  font-size: 13px;  line-height: 30px;   font-size: 18px;  height: 30px;  text-decoration: none;">X</a>
                            <img src="` +
      getURL("assets/images/header.png") +
      `" style="  position: absolute; height: 40px;  width: auto;   top: 2px;  left: 5px;" />
                         
                            <div  style="text-align:center;"><img   style="display:inline-block !important;"  src="` +
      getURL("assets/images/searching.gif") +
      `" /></div>
                            <div style="padding:15px !important; font-size:18px;">` +
      translation.testing_coupon +
      `<span id="overlayCurrentCoupon">1</span> ` +
      translation.from +
      ` <span id="overlayTotalCoupon">` +
      discountRoObject.coupons.length +
      `</span></div>
                            <div id="testingCurrentCoupon" style="display:inline-block;  text-transform:uppercase; border-radius:4px;   padding: 5px 15px;     white-space: nowrap;  background-color: #eee;  color: #333;  font-size: 14px;  line-height: 17px; border: 1px solid #ddd;">🏷️ <span>` +
      discountRoObject.coupons[0].code +
      `</span></div>`;

    if (discountRoObject["apply_coupons_info"]["tab_required_focused"] == 1)
      html +=
        `<div style="margin-top:25px; font-weight:bold; text-align:left">` +
        translation.coupon_message_1 +
        `</div>`;

    html +=
      `<div style="margin-top:25px;  font-size: 11px; line-height: 13px;  text-align:left"><span style="color:#d59401; font-size:14px;">⚠</span>` +
      translation.coupon_message_2 +
      `</div>`;
    html += `<div style="width:100%; position:absolute; bottom:0px; left:0; height:5px; background-color:#eee;" id="discountOverlayLoadingBar"><div style="   -webkit-transition: width 1s ease-in-out;  -moz-transition: width 1s ease-in-out;   -o-transition: width 1s ease-in-out;   transition: width 1s ease-in-out; background-color:green; width:0; height:100%" id="discountOverlayInnerLoad"></div></div>
                      </div>
            `;

    $("body").append(html);
  } catch (error) {}
}

function startCouponWithRefresh() {
  try {
    resetCouponApplyCookies();
    setCookie("acai", -1, 5);
    displayCouponApplyOverLayFirst();
    setCookie("aaps", 1, 5);
    if (
      discountRoObject["apply_coupons_info"][
        "refresh_after_coupon_apply_removed"
      ] == 0
    ) {
      getTotalWithoutDiscount(true, null);
    } else {
      // console.log('remove after refresh', discountRoObject['apply_coupons_info'])
      setCookie("igip", 1, 5); // is get initial price
      if (!removeActiveCoupons()) {
        // console.log("without remove");
        setTimeout(() => {
          getTotalWithoutDiscount(false, null);
          setCookie("igip", 2, 5);
          continueCouponWithRefresh();
        }, discountRoObject["apply_coupons_info"]["remove_wait_miliseconds"]);
      }
    }
  } catch (error) {}
}
