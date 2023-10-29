import React from "react";
import { getURL } from "../core/common";

export const DisplaySuccess = ({you_saved, apply_code, original_basket, reduce_basket, continue_shopping, help_us_get_more_discount, add_review}) => {
  return (
        <div style={{ display: "none", flexDirection: "row" }} 
        id="displayAutoApplySucess">
          <div
            style={{
              width: "50%",
              margin: 20,
              marginTop: 0,
              backgroundImage: `url(${getURL("assets/images/confetti.gif")})`,
            }}
          >
            <h2 style={{ textAlign: "center", fontSize: 20 }}>
              {`${you_saved}   `}
              <strong
                id="overlaySavedMoney"
                style={{ color: "#cc2a36" }}
              ></strong>
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
                  <td style={{ padding: "0px 5px !important" }}>{`${apply_code}`}</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0px 5px !important",
                      textTransform: "uppercase",
                    }}
                    id="overlayBestCouponCode"
                  >
                    {/* 🏷️  */}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px !important" }}>{`${original_basket}`}</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0px 5px !important",
                    }}
                    id="overlayTotalPrice"
                  ></td>
                </tr>
                <tr>
                  <td style={{ padding: "0px 5px !important" }}>{`${reduce_basket}`}</td>
                  <td></td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      padding: "0px 5px !important",
                    }}
                    id="overlayDiscountPrice"
                  ></td>
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
              {`${continue_shopping}`}
            </button>
          </div>
          <div
            style={{
              float: "right",
              width: "50%",
            }}
          >
            <h2 style={{ fontSize: 14, marginTop: 70 }}>
            {`${help_us_get_more_discount}`}
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
              {`${add_review}`}
              <img
                style={{ width: 100, display: "block", margin: "0px auto" }}
                src={getURL("assets/images/stars.jpg")}
              />
            </a>
          </div>
        </div> 
  );
};

export const DisplaySad = ({no_discount_coupon_code, continue_shopping}) => {
  return ( 
      <div
          style={{
            display: "none",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          id="displayAutoApplySad"
        >
          <div
            style={{
              padding: 20,
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: 100, opacity: 0.4 }}
              src={getURL("assets/images/sadface.png")}
            />
            <div
              style={{
                fontSize: 20,
                padding: 10,
              }}
            >
              {`${no_discount_coupon_code}`}</div>
            <button
              style={{
                background: "none",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
                color: "#000",
                marginTop: 15,
                fontSize: 15,
                cursor: "pointer",
              }} 
              className="closediscountroOverlay"
            >
              {`${continue_shopping}`}
            </button>
          </div>
        </div> 
  );
};

export const DisplayProcess = ({total, testing_coupon, from, waiting, coupon_message_1, coupon_message_2}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      id="displayCouponApplyProcess"
    >
      <div id="overlaySearching">
        <img src={getURL("assets/images/searching.gif")} />
      </div>
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
        <div style={{ padding: "15px", fontSize: "18px" }} 
        id="overlayText">
          {`${testing_coupon}`}<span id="overlayCurrentCoupon" style={{paddingRight: '10px', paddingLeft: '10px'}}></span>{`  ${from}  `}
          <span id="overlayTotalCoupon" style={{paddingLeft: '10px'}}>{total>0 && total}</span>
        </div>
        <div style={{ padding: "15px", fontSize: "18px", display: 'none' }} 
        id="overlayTextWaiting">
          {`${waiting}...`}
        </div>
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
        🏷️ <span id="overlayCurrentCouponCode"></span>
      </div>
      <div
        style={{
          padding: 10,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >

        {`${coupon_message_1}`}
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
     {`${coupon_message_2}`}
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
            width: `0px`,
            height: "100%",
          }}
          id="discountOverlayInnerLoad"
        ></div>
      </div>
    </div>
  );
};

export const DisplayCouponApplyPage = ({total=-1, testing_coupon, from, waiting, coupon_message_1, coupon_message_2, no_discount_coupon_code, continue_shopping, you_saved, apply_code, original_basket, reduce_basket, help_us_get_more_discount, add_review}) => {
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
          id="displayCouponApplyDialog"
        >
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
                backgroundColor: 1 ? "#CC2A36" : "#959595",
                padding: 7,
                display: "flex",
                fontFamily: "sans-serif",
                color: "white",
                fontWeight: 600,
                borderRadius: 6,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              className="closediscountroOverlay"
            >
              X
            </div>
          </div>
            <DisplayProcess total={total} testing_coupon={testing_coupon} from={from} waiting={waiting} coupon_message_1={coupon_message_1} coupon_message_2={coupon_message_2}/>
            <DisplaySuccess you_saved={you_saved} apply_code={apply_code} original_basket={original_basket} reduce_basket={reduce_basket} continue_shopping={continue_shopping} help_us_get_more_discount={help_us_get_more_discount} add_review={add_review}/>
            <DisplaySad no_discount_coupon_code={no_discount_coupon_code} continue_shopping={continue_shopping}/>
        </div>
      </div>
    </>
  );
};
