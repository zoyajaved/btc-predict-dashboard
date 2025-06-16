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
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const API_URL = "https://zoyajaved-bitcoin-lstm-app.hf.space/predict";

function Dashboard() {
  const [prices, setPrices] = useState(Array(16).fill(""));
  const [prediction, setPrediction] = useState({ min: null, max: null });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handlePriceChange = (index, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = value;
    setPrices(updatedPrices);
  };

  const handlePredict = async () => {
    const numericPrices = prices.map(p => parseFloat(p));

    if (numericPrices.some(isNaN)) {
      alert("Please enter valid numeric values for all 16 prices.");
      return;
    }

    try {
      const res = await axios.post(API_URL, { prices: numericPrices });
      const { predicted_min, predicted_max } = res.data;
      setPrediction({ min: predicted_min, max: predicted_max });

      updateChart(numericPrices, predicted_min, predicted_max);
    } catch (err) {
      console.error("Prediction error:", err.message);
      alert("Failed to get prediction. Try again later.");
    }
  };

  const updateChart = (vals, min, max) => {
    setChartData({
      labels: vals.map((_, i) => `T-${15 - i}`),
      datasets: [
        {
          label: "Input Close Prices",
          data: vals,
          borderColor: "#00BFA6",
          tension: 0.3,
          pointRadius: 2,
          fill: false,
        },
        {
          label: "Predicted Max",
          data: Array(vals.length).fill(max),
          borderColor: "#f44336",
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: "Predicted Min",
          data: Array(vals.length).fill(min),
          borderColor: "#2196f3",
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
      ],
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>📈 Enter 16 Close Prices for Prediction</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {prices.map((price, idx) => (
          <input
            key={idx}
            type="number"
            value={price}
            onChange={(e) => handlePriceChange(idx, e.target.value)}
            placeholder={`Close ${idx + 1}`}
            style={{ padding: "8px", fontSize: "14px" }}
          />
        ))}
      </div>

      <button
        onClick={handlePredict}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        🔍 Predict Min & Max
      </button>

      {prediction.min !== null && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          <strong>Predicted Min:</strong> ${prediction.min} |{" "}
          <strong>Max:</strong> ${prediction.max}
        </p>
      )}

      {chartData.datasets.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
