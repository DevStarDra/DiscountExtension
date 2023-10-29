import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { getURL } from "../../core/common";

const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
    labels: labels,
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45],
        },
    ],
};

const LineChart = () => {
    return (
        <div className="ml-4 mt-1">
            <img src={getURL("assets/images/chart.png")} />
            <div className="flex flex-row items-center justify-between px-6 my-2">
                <div style={{
                    height: "25px", width: "65px", borderRadius: "50px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", boxShadow: "rgb(226 226 226 / 60%) 0 7px 10px -5px"
                }}>1 Month</div>
                <div style={{ height: "25px", width: "75px", borderRadius: "50px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", boxShadow: "rgb(226 226 226 / 60%) 0 7px 10px -5px" }}>3 Months</div>
                <div style={{ height: "25px", width: "65px", borderRadius: "50px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", boxShadow: "rgb(226 226 226 / 60%) 0 7px 10px -5px" }}>All</div>
            </div>
        </div>
    );
};

export default LineChart;