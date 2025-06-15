import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { fetch } from "cross-fetch";

const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const API_URL = "https://zoyajaved-bitcoin-lstm-app.hf.space/predict";


function Dashboard() {
  const [livePrice, setLivePrice] = useState(0);
  const [prices, setPrices] = useState(Array(16).fill(0));
  const [prediction, setPrediction] = useState({min: 0, max: 0});
  const [chartData, setChartData] = useState({labels: [], datasets: []});

  useEffect(() => {
    const fetchLive = async () => {
      const res = await fetch(COINGECKO);
      const val = await res.json();
      const p = val.bitcoin.usd;
      setLivePrice(p);
      setPrices(prev => [...prev.slice(1), p]);
      updateChart([...prices.slice(1), p]);
    };
    fetchLive();
    const iv = setInterval(fetchLive, 30000);
    return () => clearInterval(iv);
  }, []);

  const updateChart = (vals) => {
    setChartData({
      labels: vals.map((_, i)=>`T-${16-i}`),
      datasets: [{
        label: "Live Price",
        data: vals,
        borderColor: "#00BFA6",
        fill: false
      }]
    });
  };

  const handlePredict = async () => {
    const res = await axios.post(API_URL, {prices});
    setPrediction({min: res.data.predicted_min, max: res.data.predicted_max});
  };

  return (
    <div>
      <h2>Live Price: ${livePrice}</h2>
      <Line data={chartData} />
      <button onClick={handlePredict}>Get Prediction</button>
      <p>Min: ${prediction.min} | Max: ${prediction.max}</p>
    </div>
  );
}

export default Dashboard;
