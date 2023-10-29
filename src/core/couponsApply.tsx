import React, { useEffect, useMemo, useState } from "react";
import { getURL } from "./common";
import { useCookies } from "react-cookie";
import $ from "jquery";
import { clickElement } from "./couponApplyFunctions";

export const AutoApplyCouponPage = ({
  couponRules,
  affiliatePattern,
  coupons,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [couponsCount, setCouponsCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bestCoupon, setBestCoupon] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);  
  const [cancelable, setCancelable] = useState(false);
  let waitTime = 0;  
  let bestDiscountPrice = 0; 
  let isFinished = false;

  useEffect(() => {
    if (coupons) {
      setCouponsCount(coupons.length);
    }
    if (couponRules) {
      // if(couponRules.coupon_wait_until_is_applied_after_submission){
      //   setWaitTime(couponRules.coupon_wait_until_is_applied_after_submission);
      // }
    }
  }, []);

  useEffect(() => {
    if (couponRules) startAutoApply();
  }, [couponRules]);

  useEffect(() => {
    if (couponsCount == 0) return;
    else {
      setCurrentCoupon(coupons[currentIndex]);
      setProgress(((currentIndex+1) * 100) / couponsCount);
    }
  }, [currentIndex, couponsCount]);
 

  function removeActiveCoupons(index) {
    try {
      if (couponRules["press_to_show_everytime"] == 1 || index == 0)
        clickElement(
          couponRules["cupon_click_type"],
          couponRules["button_press_show_code_input"]
        );

      if (!couponRules["cupon_remove_button_path"]) return false;

      if ($(couponRules["cupon_remove_button_path"])) {
        if (couponRules["cupon_click_type_remove"])
          clickElement(
            couponRules["cupon_click_type_remove"],
            couponRules["cupon_remove_button_path"]
          );
        else
          clickElement(
            couponRules["cupon_click_type"],
            couponRules["cupon_remove_button_path"]
          );
      }

      if (couponRules["coupon_remove_confirmation_click_path"]) {
        if (
          $(couponRules["coupon_remove_confirmation_click_path"]).length > 0
        ) {
          setTimeout(function () {
            clickElement(
              couponRules["cupon_click_type"],
              couponRules["coupon_remove_confirmation_click_path"]
            );
          }, parseInt(couponRules["coupon_remove_confirmation_delay"]));
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const getPriceFromString = (string) => {
    string = string.replace(/[^\d.,-]/g, "");

    try {
      string = string.replace("-", "");

      if (couponRules.decimalseparator) {
        if (couponRules.thousandsseparator != "")
          string = string.replace(couponRules.thousandsseparator, "");
      }

      if (couponRules.decimalseparator) {
        if (couponRules.decimalseparator == ",")
          string = string.replace(couponRules.decimalseparator, ".");
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
  };
  const getTotalPrice = () => {
    try {
      let totalPrice = 0;
      if (!couponRules.coupon_cart_total_value_path) return 0;
      let price_element = $(couponRules.coupon_cart_total_value_path).clone(
        true
      );
      if (couponRules.coupon_cart_total_decimal_path) {
        let decimal_price = price_element
          .find(couponRules.coupon_cart_total_decimal_path)
          .text();
        price_element
          .find(couponRules.coupon_cart_total_decimal_path)
          .replaceWith("");
        totalPrice = parseFloat(
          getPriceFromString(price_element.text()) + "." + decimal_price
        );
      } else {
        totalPrice = parseFloat(
          getPriceFromString(price_element.text()).toString()
        );
      }
      return totalPrice;
    } catch (err) {
      // console.log(err);
    }
  };
  function waitUntilElement(elementPath, callback) {
    var intervalTries = 0;
    var intervalCreate = setInterval(function () { 
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

      if (typeof couponRules["try_coupon_input_tweaks"] != "undefined") {
        if (couponRules["try_coupon_input_tweaks"] == 0)
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

      var evt1 = document.createEvent("KeyboardEvent");
      evt1.initEvent("keypress", false, true);
      el[0].dispatchEvent(evt1);
    } catch (error) {}
  }

  function getTotalWithoutDiscount(index, removeAppliedCoupon, callback) {
    try {
      if (removeAppliedCoupon) {
        removeActiveCoupons(index);

        setTimeout(function () {
          var _totalPrice = getTotalPrice();
          if (_totalPrice > 0) {
            setTotalPrice(_totalPrice);
            bestDiscountPrice = _totalPrice;
          }
          if (typeof callback === "function") {
            callback();
          }
        }, parseInt(couponRules["remove_wait_miliseconds"]));
      } else {
        var _totalPrice = getTotalPrice();
        if (_totalPrice > 0) {
          setTotalPrice(_totalPrice);
          bestDiscountPrice = _totalPrice;
        }

        if (typeof callback === "function") {
          callback();
        }
      }
    } catch (error) {}
  }

  function submitCouponCode(callback = null) {
    try {
      if (couponRules["cupon_apply_type"] == "formbutton") {
        if (couponRules["button_press_show_code_input"])
          clickElement(
            couponRules["cupon_click_type"],
            couponRules["button_press_show_code_input"]
          );

        tryToFixNotPresentCouponApply($(couponRules["cupon_input_path"]));
        tryToFixNotPresentCouponApply(
          $(couponRules["cupon_input_path"]).parent()
        );

        var inputElement = $(couponRules["cupon_input_path"]);

        if (inputElement.length == 0) {
          var intervalTries = 1;
          var intervalCreate = setInterval(function () {
            tryToFixNotPresentCouponApply($(couponRules["cupon_input_path"]));

            intervalTries++;

            if (intervalTries >= 10) clearInterval(intervalCreate);
          }, 500);

          waitUntilElement(couponRules["cupon_input_path"], function () {
            if (
              (couponRules["cupon_click_type"],
              inputElement.closest("form").find("button").length == 0)
            ) {
              tryToFixNotPresentCouponApply($(couponRules["cupon_input_path"]));
              tryToFixNotPresentCouponApply(
                $(couponRules["cupon_input_path"]).parent()
              );
            }
            clickElement(
              couponRules["cupon_click_type"],
              inputElement.closest("form").find("button")
            );
            clearInterval(intervalCreate);

            if (typeof callback == "function") callback();
          });

          return false;
        } else {
          clickElement(
            couponRules["cupon_click_type"],
            inputElement.closest("form").find("button")
          );
        }
      } else if (couponRules["cupon_apply_type"] == "button") {
        if (couponRules["cupon_apply_path_element"]) {
          clickElement(
            couponRules["cupon_click_type"],
            couponRules["cupon_apply_path_element"]
          );
        }
      } else if (couponRules["cupon_apply_type"] == "form") {
        if (couponRules["cupon_input_path"]) {
          var inputElement = $(couponRules["cupon_input_path"])
            .closest("form")
            .submit();
        }
      }

      if (typeof callback == "function") callback();
    } catch (error) {}
  }

  function compareTotalPrices(current) {
    try {
      var priceAfterCoupon = getTotalPrice(); 
      if (priceAfterCoupon <= 0) return false;

      if (priceAfterCoupon < bestDiscountPrice) {
        setBestCoupon({ index: current, code: coupons[current].code, price: priceAfterCoupon});
        bestDiscountPrice = priceAfterCoupon; 
      }
    } catch (error) {}
  }
 
  function afterSubmitMoveNext(current) { 
    setTimeout(function () {
      compareTotalPrices(current); 
      applyCurrentIndexCoupon(current + 1);
    }, waitTime);
  }

  function startCouponCodeApply(index) {
    try {
      if (couponRules["button_press_show_code_input"]) {
        if (couponRules["press_to_show_everytime"] == 1 || index == 0) {
          clickElement(
            couponRules["cupon_click_type"],
            couponRules["button_press_show_code_input"]
          );
        }
        setTimeout(function () {
          waitUntilElement(couponRules["cupon_input_path"], function () {
            insertCouponInInput(
              couponRules["cupon_input_path"],
              coupons[index].code
            );

            setTimeout(function () {
              submitCouponCode(afterSubmitMoveNext(index));
            }, couponRules["remove_wait_miliseconds"]);
          });
        }, couponRules["remove_wait_miliseconds"]);
      } else {
        insertCouponInInput(
          couponRules["cupon_input_path"],
          coupons[index].code
        );
        setTimeout(function () {
          submitCouponCode(afterSubmitMoveNext(index));
        }, couponRules["remove_wait_miliseconds"]);
      }
    } catch (error) {}
  }

  function applyCurrentIndexCoupon(current) {
    try {
      setCurrentIndex(current);
      if (current == coupons.length) {  
        setShowResult(true);
        setCancelable(true);
        return;
      } 
      if (coupons[current]) {
        try {
          if (couponRules["cupon_remove_button_is_required"] == 1) {
            removeActiveCoupons(current);
            setTimeout(function () {
              startCouponCodeApply(current);
            }, couponRules["remove_wait_miliseconds"]);
          } else {
            startCouponCodeApply(current);
          }
        } catch (error) { 
        }
      }
    } catch (error) {}
  }
  const startAutoApply = () => {
    if (
      couponRules.refresh_after_coupon_apply == 1 ||
      couponRules.refresh_after_coupon_apply_removed == 1
    ) { 
      return false;
    }  
    setCancelable(false);
    waitTime = couponRules.coupon_wait_until_is_applied_after_submission;
    getTotalWithoutDiscount(0, true, applyCurrentIndexCoupon(0));
  };

  const displayAutoApply = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img
            style={{ height: 40, marginLeft: 10 }}
            src={getURL("assets/images/header.png")}
          />
          <div
            
            style={{
              marginRight: 9,
              backgroundColor: cancelable?"#CC2A36":"#959595",
              padding: 7,
              display: "flex",
              fontFamily: "sans-serif",
              color: "white",
              fontWeight: 600,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {   
              cancelable && onClose();
            }}
            aria-disabled={cancelable}
          >
            X
          </div>
        </div>
        <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
          {currentIndex >= 0 && (
            <img src={getURL("assets/images/searching.gif")} />
          )}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
            <div>{`Test coupon ${currentIndex + 1} in ${couponsCount}`}</div> 
          </div>
          <div
            id="testingCurrentCoupon"
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              borderRadius: 4,
              padding: "5px 15px",
              whiteSpace: "nowrap",
              backgroundColor: "#eee",
              color: "#333",
              fontSize: 14,
              border: "1px solid #ddd",
            }}
            // onClick={()=>setCurrentIndex(currentIndex+1)}
          >
            🏷️ <span>{currentCoupon && currentCoupon.code}</span>
          </div>
          <div
            style={{
              padding: 10,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Pentru buna aplicare a cupoanelor, va rugăm să nu schimbați si nu
            defocusați fereastra!
          </div>
          <div
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 11,
              textAlign: "left",
            }}
          >
            <span style={{ color: "#d59401", fontSize: 14 }}>⚠</span>
            Dacă aplicare automată nu funcționează corect, puteți aplica manual
            codurile de reducere apăsând pictograma discount.ro din partea
            dreaptă a ferestrei.
          </div>
          <div
            style={{
              width: "100%",
              marginTop: 10,
              bottom: 0,
              left: 0,
              height: 5,
              backgroundColor: "#eee",
            }}
            id="discountOverlayLoadingBar"
          >
            <div
              style={{
                transition: "width 1s ease-in-out 0s",
                backgroundColor: "green",
                width: `${progress}%`,
                height: "100%",
              }}
              id="discountOverlayInnerLoad"
            ></div>
          </div>
        </div>
      </>
    );
  };

  const displaySad = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItems: "center",
          }}
        > 
          <div
            style={{
              padding: 7,
              margin: 5, 
              backgroundColor: "#CC2A36",
              display: "flex",
              fontFamily: "sans-serif",
              color: "white",
              fontWeight: 600,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {  
              onClose();
            }}
          >
            X
          </div>
        </div>
        <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{padding: 20, width: '50%', display: 'flex',flexDirection: 'column',  alignItems: 'center'}}>
          <img style={{width: 100, opacity: 0.4}} src={getURL('assets/images/sadface.png')}/>
          <div style={{
            fontSize: 20,
            padding: 10,
          }}>
            Nici un cod de reducere nu poate fi aplicat cosului actual.</div>
          <button style={{
            background: "none",
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 8,
            color: "#000",
            marginTop: 15,
            fontSize: 15,
            cursor: "pointer"}} onClick={()=>{setShowResult(false); startAutoApply();}}>Continua cumparaturile</button>
        </div>
        </div>
      </>
    );
  };

  const displaySuccess = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItems: "center",
          }}
        > 
          <div
            style={{
              padding: 7,
              margin: 5, 
              backgroundColor: "#CC2A36",
              display: "flex",
              fontFamily: "sans-serif",
              color: "white",
              fontWeight: 600,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {  
              onClose();
              // setShowResult(false);
            }}
          >
            X
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div
            style={{
              width: '50%', 
              margin: 20,
              marginTop: 0,
              backgroundImage: `url(${getURL("assets/images/confetti.gif")})`,
            }}
          >
            <h2 style={{ textAlign: "center", fontSize: 20}}>
              Ai economisit{" "}
              <strong style={{ color: "#cc2a36" }}>  {`${(totalPrice - bestCoupon.price).toFixed(2)} ${couponRules.shopcurrency}`}</strong>!
            </h2>
            <div id="honeyContainer"></div>
            <table
              id="discountrocpupontable"
              style={{
                fontSize: 14,
                textAlign: "center",
                width: 250,
                margin: "20px 0px",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "0px 5px !important" }}>Cod aplicat</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0px 5px !important",
                      textTransform: "uppercase",
                    }}
                  >
                    🏷️ {bestCoupon.code}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px !important" }}>Cos original</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0px 5px !important",
                    }}
                  >
                    {`${totalPrice} ${couponRules.shopcurrency}`}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0px 5px !important" }}>Cos redus</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      padding: "0px 5px !important",
                    }}
                  >
                    
                    {`${bestCoupon.price} ${couponRules.shopcurrency}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              style={{
                background: "none",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 25,
                marginTop: 15,
                color: "#fff", 
                height: "auto",
                fontSize: 17,
                cursor: "pointer",
                backgroundColor: "#cc2a36",
              }}
            >
              Continua cumparaturile
            </button>
          </div>
          <div 
            style={{
              float: "right",
              width: '50%', 
            }}
          >
            <h2 style={{ fontSize: 14 , marginTop: 70 }}>
              Ajuta-ne sa obtinem mai multe reduceri
            </h2>
            <a
              // href="https://chrome.google.com/webstore/detail/discountro-cumpara-la-red/ffpibealclcjgmoghaocdlffiimoekeg"
              target="_blank"
              style={{
                display: "inline-block",
                textAlign: "center",
                border: "1px solid #ddd",
                width: 170,
                borderRadius: 45,
                padding: 10,
                marginTop: 25,
              }}
            >
              Adauga review
              <img
                style={{ width: 100, display: "block", margin: "0px auto" }}
                src={getURL("assets/images/stars.jpg")}
              />
            </a>
          </div>
        </div>
      </>
    );
  };
 

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: "rgb(0 0 0 / 60%)",
          display: "flex",
          zIndex: 2147483646,
        }}
        id="displayCouponApplyBackground"
      >
        <div
          style={{
            textAlign: "center",
            width: 600,
            height: "auto",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          {showResult ? (
            bestCoupon ? displaySuccess(): displaySad()) : displayAutoApply()}
        </div>
      </div>
    </>
  );
};
