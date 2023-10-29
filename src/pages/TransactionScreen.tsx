import React, { useEffect, useState } from "react";
import TransactionCard from "./components/TransactionCard";
import { getURL } from "../core/common";
import { TransactionTypes } from "../core/helper";
import { useAuth } from "../store/use-auth";
import EmptyPage from "./components/EmptyPage";

const TransactionScreen = () => {
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [filterTransactions, setFilterTransactions] = useState([]);
  const user = useAuth().user;

  useEffect(() => {
    if (!user || !user.transactions) {
      setFilterTransactions([]);
    } else {
      const transactions = user.transactions;
      if (selectedTransactionType == "all") {
        setFilterTransactions(transactions);
      } else {
        let filter = transactions.filter(
          (e) => e.current_status == selectedTransactionType
        );
        setFilterTransactions(filter);
      }
    }
  }, [, selectedTransactionType]);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href={getURL("assets/css/wallet.css")}
      />
      <div className="transaction-type-selector flex flex-row w-full my-4 mx-4">
        {TransactionTypes.map((item, index) => {
          return (
            <div
              key={index}
              className={`transaction-type-selector-item${
                item.value == selectedTransactionType ? "-s" : ""
              }`}
              onClick={() => setSelectedTransactionType(item.value)}
            >
              {item.color && (
                <div
                  style={{
                    marginRight: 8,
                    width: 8,
                    height: 8,
                    backgroundColor: item.color,
                    borderRadius: "50%",
                  }}
                />
              )}
              <div style={{ fontSize: 11 }}>{item.label}</div>
            </div>
          );
        })}
      </div>
      <div className="transaction-content">
        {filterTransactions.length > 0 ? (
          filterTransactions.map((transaction, index) => {
            return <TransactionCard key={index} item={transaction} />;
          })
        ) : (
            <div className="flex flex-row h-full justify-center items-center">
            <EmptyPage icon={getURL('assets/logos/logoWallet.svg')} message={"No transaction found for this filter"}/>
            </div>
        )}
      </div>
    </>
  );
};

export default TransactionScreen;
