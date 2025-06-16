import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/AuthForm.css"; // ✅ Using shared styles

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        firstName,
        lastName,
        phone,
        email,
      });
      alert("✅ Registered successfully!");
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-container" onSubmit={handleSubmit}>
        <h2>📝 Sign Up</h2>

        <div className="input-group">
          <label>First Name</label>
          <input
            name="firstName"
            placeholder="Enter your first name"
            required
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input
            name="lastName"
            placeholder="Enter your last name"
            required
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            required
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            required
            onChange={handleChange}
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
