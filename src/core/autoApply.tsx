import $, { get } from "jquery";
import React from "react";
import { CouponApplyOverlayWidget } from "./helper";
import { createRoot } from "react-dom/client";
import {
  getCookie,
  setCookie,
  CouponApplyFunction,
  clickElement,
} from "./couponApplyFunctions";
import {
  DisplayCouponApplyPage,
  DisplayProcess,
} from "../pages/DisplayCoupons";
import { getURL } from "./common";
import CompoundedSpace from "antd/es/space";

function removeAllAutoCouponDisplay() {
  if ($(`.${CouponApplyOverlayWidget}`).length > 0) {
    $(`.${CouponApplyOverlayWidget}`).remove();
  }
}

function closeCouponApplyOverLay() {
  // $(`.${CouponApplyOverlayWidget}`).();
  try {
    if ($(`.${CouponApplyOverlayWidget}`).length > 0) {
      $(`.${CouponApplyOverlayWidget}`)[0].style.display = "none";
    }
  } catch (error) {
    // console.log(error);
  }
}
export class AutoApply {
  coupons: any;
  couponRules: any;
  root: any;
  waitTime: any;
  functions: any;
  discountRoCodeResults = [];
  init() {
    $(document).on("click", ".closediscountroOverlay", function () {
      try {
        // resetCouponApplyCookies();
        closeCouponApplyOverLay();
        // $(`.${CouponApplyOverlayWidget}`).remove();
        return false;
      } catch (error) {
        // console.log(error);
      }
    });
  }
  constructor(_rules, _coupons) {
    this.couponRules = _rules;
    this.coupons = _coupons;
    this.functions = new CouponApplyFunction(_rules);
    this.init();
  }

  resetCouponApplyCookies() {
    setCookie("aaps", 0, 5); // auto_apply_process_started
    setCookie("ccwr", 0, 5); // cupon_code_was_removed
    setCookie("trwd", 0, 5); // total cart without discount applied
    setCookie("acai", 0, 5); // Active Coupon Index to Apply
    setCookie("bdca", 0, 5); // Best discount code applie d
    setCookie("bdci", -1, 5); // Best Discount Coupon Index
    setCookie("bdp", 0, 5); // Best Discounted Price
    setCookie("igip", 0, 5); // is get initial price
    setCookie("ilca", 0, 5); // is last coupon apply
    setCookie("refresh_call", 0, 5);

    // if(discountRoObject['apply_coupons_info']['refresh_after_coupon_apply'] == 1)
    setCookie("iraca", 0, 5); // Is refresh after Coupon Applied

    // if(discountRoObject['apply_coupons_info']['refresh_after_coupon_apply_removed'] == 1)
    setCookie("iracr", 0, 5); // Is refresh after Coupon Removed
  }

  startAutoApply() {
    if (
      this.couponRules["refresh_after_coupon_apply"] == 1 ||
      this.couponRules["refresh_after_coupon_apply_removed"] == 1
    ) { 
      this.startCouponWithRefresh();
      return false;
    }

    if (this.couponRules["coupon_wait_until_is_applied_after_submission"])
      this.waitTime = parseInt(
        this.couponRules["coupon_wait_until_is_applied_after_submission"]
      );
    this.resetCouponApplyCookies();

    $("#discountOverlayInnerLoad").css("width", "0%");
    this.displayCouponApplyOverLayFirst();
    setCookie("aaps", 1, 5);
    this.getTotalWithoutDiscount(true, this.applyCurrentIndexCoupon(this));
  }
  applyCurrentIndexCoupon(temp) {
    try {
      if (this.coupons[parseInt(getCookie("acai"))]) {
        var current_coupon = this.coupons[parseInt(getCookie("acai"))];

        if ($("#overlayCurrentCoupon"))
          $("#overlayCurrentCoupon").text(parseInt(getCookie("acai")) + 1);

        if ($("#overlayTextWaiting"))
          $("#overlayTextWaiting")[0].style.display = "none";
        if ($("#overlayText")) $("#overlayText")[0].style.display = "flex";
        if ($("#testingCurrentCoupon"))
          $("#testingCurrentCoupon span").text(
            this.coupons[parseInt(getCookie("acai"))].code
          );

        var percentTitle = 100 / this.coupons.length;
        var loading_width = percentTitle * (parseInt(getCookie("acai")) + 1);
        if ($("#overlayCurrentCoupon").length > 0)
          $("#overlayCurrentCoupon")[0].innerHTML = (
            parseInt(getCookie("acai")) + 1
          ).toString();
        if ($("#overlayTotalCoupon").length > 0)
          $("#overlayTotalCoupon")[0].innerHTML = temp.coupons.length;
        $("#discountOverlayInnerLoad").css("width", loading_width + "%");

        this.applySpecificCouponCode(current_coupon["code"]);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  submitCouponCode(callback = null) {
    try { 
      if (this.couponRules["refresh_after_coupon_apply_removed"] == 1)
        setCookie("iracr", 0, 5); // Is refresh after Coupon Removed

      if (this.couponRules["refresh_after_coupon_apply"] == 1)
        setCookie("iraca", 1, 5); // Is refresh after Coupon Applied

      if (this.couponRules["cupon_apply_type"] == "formbutton") {
        if (this.couponRules["button_press_show_code_input"])
          clickElement(
            this.couponRules["cupon_click_type"],
            this.couponRules["button_press_show_code_input"]
          );

        this.functions.tryToFixNotPresentCouponApply(
          $(this.couponRules["cupon_input_path"])
        );
        this.functions.tryToFixNotPresentCouponApply(
          $(this.couponRules["cupon_input_path"]).parent()
        );

        var inputElement = $(this.couponRules["cupon_input_path"]);

        if (inputElement.length == 0) {
          var intervalTries = 1;
          var intervalCreate = setInterval(function () {
            this.functions.tryToFixNotPresentCouponApply(
              $(this.couponRules["cupon_input_path"])
            );

            intervalTries++; 

            if (intervalTries >= 10) clearInterval(intervalCreate);
          }, 500);
          this.functions.waitUntilElement(
            this.couponRules["cupon_input_path"],
            function () { 
              if (
                (this.couponRules["cupon_click_type"],
                inputElement.closest("form").find("button").length == 0)
              ) {
                this.functions.tryToFixNotPresentCouponApply(
                  $(this.couponRules["cupon_input_path"])
                );
                this.functions.tryToFixNotPresentCouponApply(
                  $(this.couponRules["cupon_input_path"]).parent()
                );
              } 
              clickElement(
                this.couponRules["cupon_click_type"],
                inputElement.closest("form").find("button")
              ); 
              clearInterval(intervalCreate);

              if (typeof callback == "function") callback();
            }
          );

          return false;
        } else {
          clickElement(
            this.couponRules["cupon_click_type"],
            inputElement.closest("form").find("button")
          );
        }
      } else if (this.couponRules["cupon_apply_type"] == "button") {
        if (this.couponRules["cupon_apply_path_element"]) {
          clickElement(
            this.couponRules["cupon_click_type"],
            this.couponRules["cupon_apply_path_element"]
          );
        }
      } else if (this.couponRules["cupon_apply_type"] == "form") {
        if (this.couponRules["cupon_input_path"]) {
          var inputElement = $(this.couponRules["cupon_input_path"])
            .closest("form")
            .submit();
        }
      }

      //  if(discountRoObject['apply_coupons_info']['refresh_after_coupon_apply'] == 1 && getCookie())

      if (typeof callback == "function") callback();
    } catch (error) {
      // console.log(error);
    }
  }

  compareTotalPrices() {
    try {
      var priceAfterCoupon = parseFloat(this.functions.getTotalPrice());
      if (priceAfterCoupon <= 0) return false;

      var acai = parseInt(getCookie("acai"));
      var trwd = parseFloat(getCookie("trwd"));
      var bdp = parseFloat(getCookie("bdp")); 
      if (priceAfterCoupon < bdp) {
        setCookie("bdp", priceAfterCoupon, 5);
        setCookie('bdca', this.coupons[acai-1].code, 5);
        setCookie("bdci", acai - 1, 5);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  afterSubmitMoveNext(temp) {
    setTimeout(function () {
      temp.compareTotalPrices();
      temp.moveToTheNextCode();
    }, temp.waitTime);
  }

  moveToTheNextCode() {
    if (parseInt(getCookie("aaps")) == 0) return false;

    try {
      var acai = parseInt(getCookie("acai"));

      var limit = this.coupons.length - 1;

      if (acai < limit) {
        setCookie("acai", acai + 1, 5);
        this.applyCurrentIndexCoupon(this);
      } else {
        var bdci = parseInt(getCookie("bdci"));
        if (bdci > -1) {
          if (bdci == acai) {
            this.displayBestCoupon();
          } else {
            if (this.couponRules["cupon_remove_button_is_required"] == 1) {
              this.removeActiveCoupons();
              var temp = this;
              setTimeout(function () {
                temp.startCouponCodeApply(this.coupons[bdci]["code"], false);
              }, temp.couponRules["remove_wait_miliseconds"]);
            } else {
              // console.log('Applying no remove: '+discountRoObject['coupons'][bdci]['code']);
              this.startCouponCodeApply(this.coupons[bdci]["code"], false);
            }
          }
        } else {
          this.displayBestCoupon();
        }

        setCookie("aaps", 0, 5);
      }
    } catch (error) {
      // console.log(error);
    }
  }
  displayBestCoupon() {
    let bestCouponPrice = parseFloat(getCookie("bdp")).toFixed(2);
    let bestCouponIndex = parseInt(getCookie("bdci"));
    let totalPrice = parseFloat(getCookie("trwd")).toFixed(2);
    let coupon = this.coupons[bestCouponIndex];
    let savedMoney = parseFloat(totalPrice) - parseFloat(bestCouponPrice);
    let currency = "Lei";
    if (this.couponRules.shopcurrency) currency = this.couponRules.shopcurrency;
    if ($("#displayCouponApplyProcess").length > 0) {
      $("#displayCouponApplyProcess")[0].style.display = "none";
      if (bestCouponIndex > -1 && savedMoney > 0) {
        $("#overlaySavedMoney")[0].innerHTML = savedMoney.toFixed(2) + currency;
        $("#overlayBestCouponCode")[0].innerHTML = "🏷️" + coupon.code;
        $("#overlayTotalPrice")[0].innerHTML = totalPrice + currency;
        $("#overlayDiscountPrice")[0].innerHTML = bestCouponPrice + currency;
        let successComponent = $("#displayAutoApplySucess")[0];
        successComponent.style.display = "flex";
      } else {
        let successComponent = $("#displayAutoApplySad")[0];
        successComponent.style.display = "flex";
      }
    }

    this.resetCouponApplyCookies();
    setCookie("aaps", 0, 5); 
    setCookie("refresh_call", 0, 5);
  }
  startCouponCodeApply(code, moveNext) {
    try {
      var temp = this;
      if (temp.couponRules["button_press_show_code_input"]) {
        // console.log('startCouponCodeApply1');

        if (
          temp.couponRules["press_to_show_everytime"] == 1 ||
          // jQuery(discountRoObject['apply_coupons_info']['cupon_input_path']).length == 0 ||

          parseInt(getCookie("acai")) == 0
        ) {
          // if(  jQuery(discountRoObject['apply_coupons_info']['cupon_input_path']).length == 0 ||  jQuery(discountRoObject['apply_coupons_info']['cupon_input_path']).is(":hidden")  )
          clickElement(
            temp.couponRules["cupon_click_type"],
            temp.couponRules["button_press_show_code_input"]
          );
        }
        setTimeout(function () {
          temp.functions.waitUntilElement(
            temp.couponRules["cupon_input_path"],
            function () {
              temp.functions.insertCouponInInput(
                temp.couponRules["cupon_input_path"],
                code
              );

              setTimeout(function () {
                if (moveNext) {
                  temp.submitCouponCode(temp.afterSubmitMoveNext(temp));
                } else {
                  temp.submitCouponCode();
                  temp.displayBestCoupon();
                }
              }, temp.couponRules["remove_wait_miliseconds"]);
            }
          );
        }, temp.couponRules["remove_wait_miliseconds"]);
      } else {
        temp.functions.insertCouponInInput(
          temp.couponRules["cupon_input_path"],
          code
        );

        setTimeout(function () {
          if (moveNext) {
            temp.submitCouponCode(temp.afterSubmitMoveNext(temp));
          } else {
            temp.submitCouponCode();
            temp.displayBestCoupon();
          }
        }, temp.couponRules["remove_wait_miliseconds"]);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  applySpecificCouponCode(code) {
    try {
      var temp = this;
      if (this.couponRules["cupon_remove_button_is_required"] == 1) {
        //if(setCookie('iracr') == 0)
        this.removeActiveCoupons();

        setTimeout(function () {
          temp.startCouponCodeApply(code, true);
        }, temp.couponRules["remove_wait_miliseconds"]);
      } else {
        temp.startCouponCodeApply(code, true);
      }
    } catch (error) {
      // console.log(error);
    }
  }
  removeActiveCoupons() {
    try {
      var temp = this;
      let isRemoved = false; 
      // if (this.couponRules["refresh_after_coupon_apply_removed"] == 1)
      //   setCookie("iracr", 1, 5); // Is refresh after Coupon Removed

      // if (this.couponRules["refresh_after_coupon_apply"] == 0)
      //   setCookie("iraca", 0, 5); // Is refresh after Coupon Applied

      if (
        this.couponRules["press_to_show_everytime"] == 1 ||
        parseInt(getCookie("acai")) == 0
      )
        clickElement(
          this.couponRules["cupon_click_type"],
          this.couponRules["button_press_show_code_input"]
        );

      if (!this.couponRules["cupon_remove_button_path"]) return false; 
      setCookie('refresh_call', 0, 5);
      if ($(this.couponRules["cupon_remove_button_path"])) { 
        if ($(this.couponRules["cupon_remove_button_path"]).length > 0) {
          isRemoved = true; 
          if ($(this.couponRules["cupon_remove_button_path"])[0].disabled){ 
            $(this.couponRules["cupon_remove_button_path"])[0].disabled = false;
          }
          if (this.couponRules["cupon_click_type_remove"])
            clickElement(
              this.couponRules["cupon_click_type_remove"],
              this.couponRules["cupon_remove_button_path"]
            );
          else
            clickElement(
              this.couponRules["cupon_click_type"],
              this.couponRules["cupon_remove_button_path"]
            );
        }
      }

      if (this.couponRules["coupon_remove_confirmation_click_path"]) {
        if (
          $(this.couponRules["coupon_remove_confirmation_click_path"]).length >
          0
        ) {
          isRemoved = true;
          setTimeout(function () {
            clickElement(
              temp.couponRules["cupon_click_type"],
              temp.couponRules["coupon_remove_confirmation_click_path"]
            );
          }, parseInt(this.couponRules["coupon_remove_confirmation_delay"]));
        }
      }
      return isRemoved;
    } catch (error) {
      // console.log(error);
      return 3;
    }
  }
  getTotalWithoutDiscount(removeAppliedCoupon, callback) {
    try {
      var temp = this;
      if (removeAppliedCoupon) {
        this.removeActiveCoupons();
        setTimeout(function () {
          var totalPrice = temp.functions.getTotalPrice();

          if (totalPrice > 0) {
            setCookie("trwd", totalPrice, 5);
            setCookie("bdp", totalPrice, 5);
            setCookie("igip", 1, 5);
          }

          //

          if (typeof callback === "function") { 
            // console.log(callback)
            callback();
          }
        }, parseInt(temp.couponRules["remove_wait_miliseconds"]));
      } else {
        var totalPrice = temp.functions.getTotalPrice();

        if (totalPrice > 0) {
          setCookie("trwd", totalPrice, 5);
          setCookie("bdp", totalPrice, 5);
          setCookie("igip", 1, 5);
        }

        if (typeof callback === "function") { 
          callback();
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }
  displayCouponApplyOverLayFirst() {
    try {
      if ($(`.${CouponApplyOverlayWidget}`).length > 0) {
        $(`.${CouponApplyOverlayWidget}`)[0].style.display = "flex";
        $("#displayAutoApplySucess")[0].style.display = "none";
        $("#displayAutoApplySad")[0].style.display = "none";
        $("#displayCouponApplyProcess")[0].style.display = "flex";
      }
    } catch (error) {
      // console.log(error);
    }
  }

  startCouponCodeApplyRefresh(code) {
    try {
      var temp = this;
      if (this.couponRules["button_press_show_code_input"]) {
        if (
          this.couponRules["press_to_show_everytime"] == 1 ||
          parseInt(getCookie("acai")) == 0
        )
          clickElement(
            this.couponRules["cupon_click_type"],
            this.couponRules["button_press_show_code_input"]
          );

        setTimeout(function () {
          temp.functions.waitUntilElement(
            temp.couponRules["cupon_input_path"],
            function () {
              temp.functions.insertCouponInInput(
                temp.couponRules["cupon_input_path"],
                code
              );

              setTimeout(function () {
                setCookie('refresh_call', 0, 5);
                temp.submitCouponCode(()=>{setCookie('acai', parseInt(getCookie('acai'))+1, 5)}); 
                // setCookie("refresh_call", 0, 5);
              }, temp.couponRules["remove_wait_miliseconds"]);
            }
          );
        }, temp.couponRules["remove_wait_miliseconds"]);
      } else {
        temp.functions.insertCouponInInput(
          temp.couponRules["cupon_input_path"],
          code
        );
        setTimeout(function () {
          setCookie('refresh_call', 0, 5);
          temp.submitCouponCode(()=>{setCookie('acai', parseInt(getCookie('acai'))+1, 5)}); 
          // setCookie("refresh_call", 0, 5);
        }, temp.couponRules["remove_wait_miliseconds"]);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  applyCurrentIndexRefresh() {
    try {
      if (this.coupons[parseInt(getCookie("acai"))]) {
        var current_coupon = this.coupons[parseInt(getCookie("acai"))];
        if ($("#overlayText")) $("#overlayText")[0].style.display = "flex";

        if ($("#overlayCurrentCoupon"))
          $("#overlayCurrentCoupon").text(parseInt(getCookie("acai")) + 1);
        if ($("#overlayTextWaiting"))
          $("#overlayTextWaiting")[0].style.display = "none";
        if ($("#testingCurrentCoupon"))
          $("#testingCurrentCoupon span").text(
            this.coupons[parseInt(getCookie("acai"))].code
          );
        if ($("#testingCurrentCoupon"))
          $("#testingCurrentCoupon span").text(current_coupon.code);
        var percentTitle = 100 / this.coupons.length;
        var loading_width = percentTitle * (parseInt(getCookie("acai")) + 1);
        $("#discountOverlayInnerLoad").css("width", loading_width + "%"); 
        this.startCouponCodeApplyRefresh(current_coupon["code"]);
      }
    } catch (error) {
      // console.log(error);
    }
  }
  continueCouponWithRefresh() {
    try {
      // firstly if igip == 1
      if(parseInt(getCookie('ilca')) == 1){ 
        setCookie('ilca', 2 ,5);
        this.startCouponCodeApplyRefresh(getCookie('bdca'));
        return;
      }
      if(parseInt(getCookie('ilca')) == 2){
        this.displayCouponApplyOverLayFirst();
        this.displayBestCoupon();
        return;
      }
      var temp =this; 
      if (parseInt(getCookie("acai")) < this.coupons.length) {
        
        setCookie('refresh_call', 0, 5);
        if ($("#overlayText")) $("#overlayText")[0].style.display = "none";

        if ($("#overlayTextWaiting"))
          $("#overlayTextWaiting")[0].style.display = "flex";
        this.displayCouponApplyOverLayFirst();
        if (
          parseInt(getCookie("igip")) == 0 ||
          parseInt(getCookie("acai")) == 0
        ) {
          var priceAfterCoupon = parseFloat(this.functions.getTotalPrice());
          if (priceAfterCoupon <= 0) return false;
          setCookie("trwd", priceAfterCoupon, 5);
          setCookie("bdp", priceAfterCoupon, 5);
          setCookie("igip", 1, 5);
        } else { 
          this.compareTotalPrices();
        }
        if (this.couponRules["refresh_after_coupon_apply_removed"] == 1) {
          setTimeout(()=>{
          if (!temp.removeActiveCoupons()) {
            if (temp.couponRules["refresh_after_coupon_apply_removed"] == 1) {
              setTimeout(()=>{
                temp.applyCurrentIndexRefresh();
              }, temp.couponRules['remove_wait_miliseconds']);
            } else { 
            }
          }
        }, temp.couponRules['remove_wait_miliseconds']);
          // setCookie("refresh_call", 0, 5);
        } else {
          this.removeActiveCoupons();
          setTimeout(() => {
            temp.applyCurrentIndexRefresh();
          }, temp.couponRules["remove_wait_miliseconds"]);
        }
      } else {
        if(parseInt(getCookie('bdci')) == parseInt(getCookie('acai')) - 1 ){
          setCookie('ilca', 2, 5);
          setCookie('refresh_call', 0, 5);
        }
        else{
          setCookie('ilca', 1,5);
          if(!temp.removeActiveCoupons()){
            setTimeout(()=>{ 
              temp.startCouponCodeApplyRefresh(getCookie('bdca'));
            }, this.couponRules['remove_wait_miliseconds']);
          }
        }

      }
    } catch (error) {
      // console.log(error);
    }
  }

  startCouponWithRefresh() {
    try {
      var temp = this; 
      this.resetCouponApplyCookies();

      if ($("#overlayText")) $("#overlayText")[0].style.display = "none";
      if ($("#overlayTextWaiting"))
        $("#overlayTextWaiting")[0].style.display = "flex";
      if ($("#testingCurrentCoupon"))
        $("#testingCurrentCoupon span").text(
          this.coupons[parseInt(getCookie("acai"))].code
        );
      if ($("#overlayCurrentCouponCode")) {
        $("#overlayCurrentCouponCode").text("...");
      }
      var loading_width = 0;
      $("#discountOverlayInnerLoad").css("width", loading_width + "%");
      this.displayCouponApplyOverLayFirst();
      // setCookie("aaps", 1, 5);
      var temp =this; 
      if (this.couponRules["refresh_after_coupon_apply_removed"] == 0) {
        setCookie('aaps', 1, 5); 
        this.removeActiveCoupons(); 
        setTimeout(() => {
          temp.getTotalWithoutDiscount(true, () => {});
        }, this.couponRules["remove_wait_miliseconds"]);
      } else { 
        setCookie('aaps', 1, 5); 
        if (!this.removeActiveCoupons()) {
          // first apply without refresh
          // setCookie("refresh_call", 0, 5);   
          setTimeout(() => { 
            temp.getTotalWithoutDiscount(true, () => { 
              temp.continueCouponWithRefresh();
            });
          }, this.couponRules["remove_wait_miliseconds"]);
        } else { 
          setCookie('refresh_call', 0, 5);
        }
      }
    } catch (error) {
      // console.log(error);
    }

    //getTotalWithoutDiscount(true, applyCurrentIndexCoupon);
  }
}
