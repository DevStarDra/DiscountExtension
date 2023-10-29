import React from "react";
import { getURL } from "../../core/common";
import { useMultiLanguage } from "../../store/multi-language";

const CouponCard2 = ({ item, selected, setSelect, type = "coupon" }) => {
  const language = useMultiLanguage();
  return (
    <div className="coupon-card-2">
      <div
        className="flex flex-col justify-evenly items-center w-25p"
        style={{
          fontSize: "17px",
          color: "#cc2a36",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {type == "offer" && (
          <div>
            <img src={getURL("assets/logos/iconOffer.svg")} />
          </div>
        )}
        {item.offer_text}
      </div>
      <div className="pl-1">
        <div className="flex flex-row  items-center">
          <div
            className="text-rose-600"
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            Code
          </div>
          <img
            className="pl-1"
            style={{ width: 15 }}
            src={getURL("assets/logos/iconCheck.svg")}
          />
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            verfied
          </div>
        </div>
        <div className="title">{item.offer_name}</div>
        <div
          className={
            item.code == selected ? "coupon-button-selected" : "coupon-button"
          }
          onClick={() => setSelect(item.code)}
        >
          <div className="w-full mr-4">{item.code}</div>
          {item.code != selected && (
            <div className="absolute flex items-center justify-center h-full" style={{width: 230 }}>
              <div
                className="text-sm text-center text-white flex items-center"
                style={{
                    paddingLeft:50,
                  background:
                    "linear-gradient(109deg, #cc2a36 75%, #ffffff00 20%)",
                    height: '100%',
                    width: '100%',
                    borderRadius: '50px',
                }}
              >
                {language.get("copy_coupon")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard2;
