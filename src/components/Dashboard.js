import React, { useState, useEffect } from "react";
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
  const [livePrice, setLivePrice] = useState(0);
  const [prices, setPrices] = useState(Array(16).fill(0));
  const [prediction, setPrediction] = useState({ min: 0, max: 0 });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch and update price every 30 seconds
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(COINGECKO);
        const val = await res.json();
        const current = val?.bitcoin?.usd ?? 0;

        setLivePrice(current);

        setPrices((prev) => {
          const updated = [...prev.slice(1), current];
          updateChart(updated);
          return updated;
        });
      } catch (err) {
        console.error("Failed to fetch live price:", err.message);
      }
    };

    fetchLive(); // initial fetch
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateChart = (vals) => {
    setChartData({
      labels: vals.map((_, i) => `T-${15 - i}`),
      datasets: [
        {
          label: "BTC Price (USD)",
          data: vals,
          borderColor: "#00BFA6",
          tension: 0.3,
          pointRadius: 2,
          fill: false,
        },
      ],
    });
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post(API_URL, { prices });
      setPrediction({
        min: res.data.predicted_min,
        max: res.data.predicted_max,
      });
    } catch (err) {
      console.error("Prediction error:", err.message);
      alert("Failed to get prediction. Try again later.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live BTC Price: ${livePrice}</h2>
      <div style={{ width: "100%", maxWidth: 800, margin: "auto" }}>
        <Line data={chartData} />
      </div>
      <button
        onClick={handlePredict}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Get Prediction
      </button>
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        <strong>Predicted Min:</strong> ${prediction.min} |{" "}
        <strong>Max:</strong> ${prediction.max}
      </p>
    </div>
  );
}

export default Dashboard;
