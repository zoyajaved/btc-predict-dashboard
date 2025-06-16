import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">BTC Predictor</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Sign Up</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/prediction">Prediction</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Predict Bitcoin Prices Using AI</h1>
        <p>
          Our LSTM-powered app helps you predict future Bitcoin prices using deep learning.
          View live prices, generate predictions, and track trends with confidence.
        </p>
        <div className="cta">
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/login" className="btn outline">Login</Link>
        </div>
      </header>
    </div>
  );
}

export default Home;
