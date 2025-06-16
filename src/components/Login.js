import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../styles/AuthForm.css"; // ✅ Modern styling

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const q = query(collection(db, "users"), where("firstName", "==", name));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("❌ No user found with this first name.");
        return;
      }

      const userData = snapshot.docs[0].data();
      await signInWithEmailAndPassword(auth, userData.email, pass);
      onLogin(); // ✅ Redirect to Dashboard
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h2>🔐 Login</h2>
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
