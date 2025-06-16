// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
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
import "./Dashboard.css"; // ✅ Importing professional CSS

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

function Dashboard() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchPrice = async () => {
    try {
      const res = await axios.get(COINGECKO);
      const current = res.data.bitcoin.usd;
      setPrice(current);
      setHistory((prev) => [...prev.slice(-19), current]); // keep last 20
    } catch (err) {
      console.error("Price fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // update every 5 sec
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map((_, i) => `T-${history.length - 1 - i}`),
    datasets: [
      {
        label: "Live Bitcoin Price (USD)",
        data: history,
        borderColor: "#00BFA6",
        tension: 0.3,
        fill: false,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome to the Dashboard</h1>
      <h2 className="dashboard-title">📊 Live Bitcoin Dashboard</h2>
      <p className="current-price"><strong>Current Price:</strong> ${price}</p>

      <div className="chart-container">
        <Line data={chartData} />
      </div>

      <button
        onClick={() => navigate("/predict")}
        className="predict-btn"
      >
        🔮 Generate Prediction
      </button>
    </div>
  );
}

export default Dashboard;
