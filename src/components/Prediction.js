import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Prediction.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const API_URL = "https://zoyajaved-bitcoin-lstm-app.hf.space/predict";
const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=minute";

function Prediction() {
  const location = useLocation();
  const currentPrice = location.state?.currentPrice || null;

  const [prices, setPrices] = useState(Array(16).fill(""));
  const [prediction, setPrediction] = useState({ min: null, max: null });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchLast16Prices = async () => {
    try {
      const response = await fetch(COINGECKO_API);
      const data = await response.json();
      const allPrices = data.prices.map((p) => p[1]);
      const last16 = allPrices.slice(-16);
      setPrices(last16.map((p) => p.toFixed(2))); // Fill readonly input fields
      return last16;
    } catch (error) {
      console.error("Error fetching prices from CoinGecko:", error);
      alert("Failed to fetch data from CoinGecko.");
      return [];
    }
  };

  const handlePredict = async () => {
    const last16 = await fetchLast16Prices();

    if (last16.length !== 16) {
      alert("Not enough data from CoinGecko.");
      return;
    }

    try {
      const res = await axios.post(API_URL, { prices: last16 });
      const { predicted_min, predicted_max } = res.data;
      setPrediction({ min: predicted_min, max: predicted_max });

      const labels = last16.map((_, i) => `T-${15 - i}`);
      labels.push("Predicted Min", "Current", "Predicted Max");

      setChartData({
        labels,
        datasets: [
          {
            label: "Close Prices",
            data: [...last16, null, null, null],
            borderColor: "#00BFA6",
            tension: 0.3,
            pointRadius: 2,
            fill: false,
          },
          {
            label: "Predicted Max",
            data: [...Array(16).fill(null), null, null, predicted_max],
            borderColor: "#f44336",
            borderDash: [5, 5],
            pointRadius: 3,
            fill: false,
          },
          {
            label: "Predicted Min",
            data: [...Array(16).fill(null), predicted_min, null, null],
            borderColor: "#2196f3",
            borderDash: [5, 5],
            pointRadius: 3,
            fill: false,
          },
          {
            label: "Current Price",
            data: [...Array(16).fill(null), null, currentPrice, null],
            borderColor: "#ffc107",
            borderDash: [2, 4],
            pointRadius: 4,
            fill: false,
          },
        ],
      });
    } catch (err) {
      console.error("Prediction error:", err.message);
      alert("Prediction failed.");
    }
  };

  return (
    <div className="container">
      <h2>🔮 Bitcoin Price Prediction</h2>

      <div className="info-boxes">
        <div className="info-box">Currency: Bitcoin</div>
        <div className="info-box">Model: LSTM</div>
      </div>

      <div className="input-grid">
        {prices.map((price, idx) => (
          <input
            key={idx}
            type="text"
            value={price}
            readOnly
            placeholder={`T-${15 - idx}`}
          />
        ))}
      </div>

      <button onClick={handlePredict}>Predict</button>

      {prediction.min !== null && prediction.max !== null && (
        <>
          <div className="result-boxes">
            <div className="result-box">
              <strong>Predicted Min:</strong> {prediction.min.toFixed(2)}
            </div>
            <div className="result-box">
              <strong>Predicted Max:</strong> {prediction.max.toFixed(2)}
            </div>
          </div>

          {currentPrice && (
            <p style={{ textAlign: "center", color: "#ccc", marginTop: "10px" }}>
              <strong>Current Live Price:</strong> ${currentPrice.toFixed(2)}
            </p>
          )}

          <div className="chart-container">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom", labels: { color: "#e2e8f0" } },
                },
                scales: {
                  x: { ticks: { color: "#e2e8f0" } },
                  y: { ticks: { color: "#e2e8f0" } },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Prediction;
