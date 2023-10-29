import $ from "jquery";
export function clickElement(typeOfClick, element) {
    try {
      if($(element) && $(element)[0] && $(element)[0].disabled){
        $(element)[0].disabled = false;
      }
      if (typeOfClick == "jquery") { 
        if (typeof element == "string") {
          $(element).click(); 
        } else element.click();
      } else if (typeOfClick == "go_to_href") {
        let href = null;
        if (typeof element == "string") href = $(element).attr("href");
        else href = element.attr("href");
  
        if (href) document.location.href = href;
      } else if (typeOfClick == "bubleEvent") {
        var valid = false;
  
        if (typeof element == "string") {
          if ($(element).length > 0) valid = true;
        } else {
          if (element.length > 0) valid = true;
        }
  
        if (valid) {
          var event = document.createEvent("Event");
          event.initEvent("click", true, true);
  
          if (typeof element == "string") $(element)[0].dispatchEvent(event);
          else element[0].dispatchEvent(event);
        }
      } else if (typeOfClick == "bubleEventJquery") {
        var valid = false;
  
        if (typeof element == "string") {
          if ($(element).length > 0) valid = true;
        } else {
          if (element.length > 0) valid = true;
        }
  
        if (valid) {
          var event = document.createEvent("Event");
          event.initEvent("click", true, true);
  
          if (typeof element == "string") $(element)[0].dispatchEvent(event);
          else element[0].dispatchEvent(event);
        }
  
        if (typeof element == "string") {
          $(element).click();
        } else {
          element.click();
        }
      } else if (typeOfClick == "enterpress") {
        // NOT WORKING YET
   
        let event = new KeyboardEvent('keydown', {
            keyCode: 13
        });
        $(element)[0].dispatchEvent(event);
      }
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }
  
export function getCookie ( cname )
  {
   
    let name = cname + "=";
  
    let decodedCookie = decodeURIComponent( document.cookie );
    let ca = decodedCookie.split( ';' );
    for ( let i = 0; i < ca.length; i++ )
    {
      let c = ca[ i ];
      while ( c.charAt( 0 ) == ' ' )
      {
        c = c.substring( 1 );
      }
      if ( c.indexOf( name ) == 0 ) 
      {
        return c.substring( name.length, c.length ).replace( '--percent--', '%' );
      }
    }
    return "";
  }

  
export function setCookie ( cname, cvalue, exminutes )
{

	if ( typeof cvalue == 'undefined' )
		return false;

	if ( cvalue.length > 0 )
		cvalue = cvalue.replace( '%', '--percent--' );

	if ( typeof ( exminutes ) != 'undefined' )
		exminutes = parseInt( exminutes );
	else
		exminutes = 60;

	const d = new Date();
	d.setTime( d.getTime() + ( exminutes * 60 * 1000 ) );
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


export class CouponApplyFunction{
  couponRules: any;
  constructor(rules){
    this.couponRules = rules;
  }
  removeActiveCoupons() { 
    try {
      if (this.couponRules["press_to_show_everytime"] == 1 || parseInt(getCookie('acai')) == 0)
        clickElement(
          this.couponRules["cupon_click_type"],
          this.couponRules["button_press_show_code_input"]
        );
  
      if (!this.couponRules["cupon_remove_button_path"]) return false;
  
      if ($(this.couponRules["cupon_remove_button_path"])) {
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
  
      if (this.couponRules["coupon_remove_confirmation_click_path"]) {
        if (
          $(this.couponRules["coupon_remove_confirmation_click_path"]).length > 0
        ) {
          setTimeout(function () {
            clickElement(
              this.couponRules["cupon_click_type"],
              this.couponRules["coupon_remove_confirmation_click_path"]
            );
          }, parseInt(this.couponRules["coupon_remove_confirmation_delay"]));
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };
  
  getPriceFromString(string){
    string = string.replace(/[^\d.,-]/g, "");
  
    try {
      string = string.replace("-", "");
  
      if (this.couponRules.decimalseparator) {
        if (this.couponRules.thousandsseparator != "")
          string = string.replace(this.couponRules.thousandsseparator, "");
      }
  
      if (this.couponRules.decimalseparator) {
        if (this.couponRules.decimalseparator == ",")
          string = string.replace(this.couponRules.decimalseparator, ".");
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
  
  getTotalPrice(){
    try {
      let totalPrice = 0;
      if (!this.couponRules.coupon_cart_total_value_path) return 0;
      let price_element = $(this.couponRules.coupon_cart_total_value_path).clone(
        true
      );
      if (this.couponRules.coupon_cart_total_decimal_path) {
        let decimal_price = price_element
          .find(this.couponRules.coupon_cart_total_decimal_path)
          .text();
        price_element
          .find(this.couponRules.coupon_cart_total_decimal_path)
          .replaceWith("");
        totalPrice = parseFloat(
          this.getPriceFromString( price_element.text()) + "." + decimal_price
        );
      } else {
        totalPrice = parseFloat(
          this.getPriceFromString( price_element.text()).toString()
        );
      }
      return totalPrice;
    } catch (err) {
      // console.log(err);
    }
  };
  
  waitUntilElement(elementPath, callback) {
    let intervalTries = 0;
    let intervalCreate = setInterval(function () { 
      if ($(elementPath).length > 0) {
        callback();
        clearInterval(intervalCreate);
        return false;
      } 
      intervalTries++; 
      if (intervalTries >= 20) clearInterval(intervalCreate);
    }, 500);
  }
  
  insertCouponInInput(inputPath, code) {
    // try { 
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
  
      if (typeof this.couponRules["try_coupon_input_tweaks"] != "undefined") {
        if (this.couponRules["try_coupon_input_tweaks"] == 0)
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
    // } catch (error) {}
  }
  
  tryToFixNotPresentCouponApply(el) {
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
  
}