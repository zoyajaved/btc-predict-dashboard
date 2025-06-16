import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
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

function Prediction() {
  const [prices, setPrices] = useState(Array(16).fill(""));
  const [prediction, setPrediction] = useState({ min: null, max: null });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handlePriceChange = (index, value) => {
    const updated = [...prices];
    updated[index] = value;
    setPrices(updated);
  };

  const handlePredict = async () => {
    const numericPrices = prices.map((p) => parseFloat(p));
    if (numericPrices.some(isNaN)) {
      alert("Please enter valid numeric values.");
      return;
    }

    try {
      const res = await axios.post(API_URL, { prices: numericPrices });
      const { predicted_min, predicted_max } = res.data;
      setPrediction({ min: predicted_min, max: predicted_max });

      setChartData({
        labels: numericPrices.map((_, i) => `T-${15 - i}`),
        datasets: [
          {
            label: "Close Prices",
            data: numericPrices,
            borderColor: "#00BFA6",
            tension: 0.3,
            pointRadius: 2,
            fill: false,
          },
          {
            label: "Predicted Max",
            data: Array(16).fill(predicted_max),
            borderColor: "#f44336",
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          },
          {
            label: "Predicted Min",
            data: Array(16).fill(predicted_min),
            borderColor: "#2196f3",
            borderDash: [5, 5],
            pointRadius: 0,
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
            type="number"
            value={price}
            onChange={(e) => handlePriceChange(idx, e.target.value)}
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
        </>
      )}
    </div>
  );
}

export default Prediction;
