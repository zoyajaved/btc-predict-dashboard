// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // ✅ Import Home styles from styles folder

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🔮 Bitcoin Price Predictor</h1>
        <p>
          Welcome to our LSTM-based Bitcoin prediction platform. This app uses deep learning (LSTM)
          to forecast future minimum and maximum prices based on your input.
        </p>
      </header>

      <nav className="home-nav">
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn">Signup</Link>
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
        <Link to="/predict" className="nav-btn">Prediction</Link>
      </nav>

      <section className="home-about">
        <h2>📈 How it Works</h2>
        <p>
          Enter 16 past closing values and our AI model will predict the expected
          minimum and maximum values for the next time window.
        </p>
        <p>
          Built with React, Firebase, Chart.js, and an LSTM deep learning model hosted on Hugging Face.
        </p>
      </section>
    </div>
  );
}

export default Home;
