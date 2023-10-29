import React, { useEffect, useState } from "react";
import { useMultiLanguage } from "../store/multi-language";
import { getCurrencyToDisplay, getURL } from "../core/common";
import Button from "./components/Button";
import moment from "moment";
import TransactionCard from "./components/TransactionCard";
import { useMemoryRouter } from "../store/memory-router";
import { CurrencyData, RouterConfig } from "../core/helper";
import { useAuth } from "../store/use-auth";

const WalletScreen = () => {
  const language = useMultiLanguage();
  const auth = useAuth();
  const router = useMemoryRouter();
  const [transactions, setTransactions] = useState([]);
  const [currencyType, setCurrencyType] = useState(CurrencyData.eur);

  useEffect(() => {
    if (auth && auth.user) {
      setTransactions(auth.user.transactions);
    }
    if (
      auth &&
      auth.user &&
      auth.user.currency &&
      CurrencyData[auth.user.currency]
    ) {
      setCurrencyType(CurrencyData[auth.user.currency]);
    }
  }, [auth]);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href={getURL("assets/css/wallet.css")}
      />
      <div className="h-full mx-2 px-1" style={{maxHeight: 640, overflowY: 'auto'}}>
        <div className="total-balance">
          <div className="header">{language.get("total_balance")}</div>
          <div className="balance-card">
            <div className="w-full mt-3">
              <div className="flex flex-col">
                <div className="flex flex-row mx-4 my-2 items-center justify-between">
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>
                      {language.get('available_for_withdraw')}
                    </div>
                    <div
                      style={{
                        paddingTop: 8,
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#AAAAAA",
                      }}
                    >
                      {language.get('shop_more_to_save_more')}
                    </div>
                  </div>
                  <div
                    className="flex justify-center items-center rounded-full bg-white text-lg bold p-1"
                    style={{ width: 62, height: 62 }}
                  >
                    {getCurrencyToDisplay(auth)}
                  </div>
                </div>
                <div className="w-full pt-4">
                  <Button
                    className="mx-6 text-md text-white"
                    style={{
                      width: "83%",
                      height: "35px",
                      border: "transparent",
                      borderRadius: 8,
                      fontWeight: 400,
                      backgroundColor:
                        auth &&
                        auth.user &&
                        auth.user.account_money &&
                        auth.user.account_money.payable_amount
                          ? "#2277F6"
                          : "#C7CADB",
                      cursor: "pointer",
                    }}
                    text={language.get('withdraw')}
                    loading={false}
                    onSubmit={() => alert("withdraw")}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-4 mx-6">
                <div className="flex flex-row justify-between ">
                  <div className=" text-base bold">{`${language.get('your_donations')} :`}</div>
                  <div className=" text-base bold">{`${currencyType} ${
                    auth &&
                    auth.user &&
                    auth.user.account_money &&
                    auth.user.account_money.donated_amount
                      ? auth.user.account_money.donated_amount
                      : 0
                  }`}</div>
                </div>
                <div
                  style={{
                    paddingTop: 6,
                    fontSize: 12,
                    color: "#2F77E1",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >{language.get('learn_more')}
                </div>
              </div>
              <div
                style={{
                  marginTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "85%",
                  height: 1,
                  backgroundColor: "#D0D0D0",
                }}
              />
              <div className="flex flex-col mt-4">
                <div className="flex flex-row mx-4 justify-between">
                  <div className="text-base bold ml-2">{language.get('pending_cash')}</div>
                  <div className="text-base bold mr-2">{`${currencyType} ${
                    auth &&
                    auth.user &&
                    auth.user.account_money &&
                    auth.user.account_money.pending_amount
                      ? auth.user.account_money.pending_amount
                      : 0
                  }`}</div>
                </div>
                <div className="flex flex-row mx-4 justify-between justify-center items-center">
                  <div
                    style={{
                      fontSize: 10,
                      width: 150,
                      padding: 10,
                      color: "#868686",
                    }}
                  >{language.get('pending_cash_detail')}
                  </div>
                  <div className="flex justify-center items-center mr-2 cursor-pointer">
                    <img src={getURL("assets/logos/iconInfo.svg")} />
                  </div>
                </div>
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
          <div className="transaction mt-8">
            <div className="transaction-title">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                  <div className="text-2xl bold">{language.get('transactions')}</div>
                  <img
                    style={{ width: 15, marginLeft: 5 }}
                    src={getURL("assets/logos/iconInfo.svg")}
                  />
                </div>
                <div
                  onClick={() => {
                    router.addPage(RouterConfig.TRANSACTION);
                  }}
                  className="flex flex-row items-baseline cursor-pointer"
                >
                  <div style={{ fontSize: 10, color: "#868686" }}>{language.get('see_all')}</div>
                  <div className="ml-2 mr-2">
                    <img
                      style={{ width: 5 }}
                      src={getURL("assets/logos/iconGT.svg")}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-1">
                {language.get('transactions_detail')}
              </div>
            </div>
            <div className="my-6">
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  return <TransactionCard key={index} item={transaction} />;
                })
              ) : (
                <div
                  style={{
                    fontSize: 15,
                    width: "80%",
                    backgroundColor: "#EBEBEB",
                    padding: 20,
                    margin: "auto",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >{language.get('no_transaction_message')}
                </div>
              )}
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default WalletScreen;
