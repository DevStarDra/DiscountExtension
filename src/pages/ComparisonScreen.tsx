import React, { useEffect, useState } from "react";
import ComparisonHeader from "./components/ComparisonHeader";
import LineChart from "./components/LineChart";
import ComparisonCard from "./components/ComparisonCard";
import { getURL } from "../core/common";
import { Divider } from "antd";
import { useMemoryRouter } from "../store/memory-router";
import Empty from "./components/EmptyCard";
import EmptyPage from "./components/EmptyPage";

const ComparisonScreen = () => {
  const [headerType, setHeaderType] = useState("compare");
  const [headerCount, setHeaderCount] = useState({ compare: 2, similar: 4 });
  const [cardList, setCardList] = useState([]);
  const [product, setProduct] = useState(null);
  const router = useMemoryRouter();

  useEffect(() => {
    if (router.product) {
      setProduct(router.product); 
      setHeaderCount({
        compare: router.product.seller_count,
        similar: router.product.similar_count,
      });
    }
  }, [router.product]);

  useEffect(() => {
    if (headerType == "compare") {
      if (product) setCardList(product.seller_list);
    } else if (headerType == "similar_product") {
      if(product.similar_products) setCardList(product.similar_products)
    }
  }, [product, headerType]);

  return (
    <>
      {product ? (
        <div className="h-full mx-3">
          <ComparisonHeader
            counter={headerCount}
            type={headerType}
            setType={setHeaderType}
          />
          {cardList.length > 0 ? ( <><div className="mt-6 ml-8" style={{ fontSize: "10px", width: "80%" }}>
            {product.product_name}
          </div>
          <div
            className=" ml-8"
            style={{ fontSize: "14px", fontWeight: "bold" }}
          >{`${product.currency} ${product.min_price} - ${product.max_price}`}</div>
          
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                height: 510,
                overflowY: "auto",
              }}
            >
              {cardList.length > 0 &&
                cardList.map((item, index) => {
                  return (
                    <div key={index} style={{ paddingTop: "0" }}>
                      <ComparisonCard item={item} />
                      <div
                        style={{
                          height: "1px",
                          width: "100%",
                          backgroundColor: "#ada9a9",
                          margin: "auto",
                        }}
                      />
                    </div>
                  );
                })}
            </div></>
          ) : headerType == "compare" ? (
            <div
              className="flex flex-col items-center"
              style={{ paddingTop: 100 }}
            >
              <EmptyPage icon={getURL('assets/logos/iconCompare.svg')} message={"No products were found to compare"} />
            </div>
          ) : (
            <div
              className="flex flex-col items-center"
              style={{ paddingTop: 100 }}
            >
              <EmptyPage icon={getURL('assets/logos/iconSimilar.svg')} message={"No similar products were found"} />
            </div>
          )}
        </div>
      ): <div
      className="flex flex-col items-center"
      style={{ paddingTop: 200 }}
    >
      <EmptyPage icon={getURL('assets/logos/iconCompare.svg')} message={"No products were found to compare"} />
    </div>}
    </>
  );
};

export default ComparisonScreen;
