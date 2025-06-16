import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/AuthForm.css"; // ✅ Import shared stylesheet

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
    <form className="auth-container" onSubmit={handleSubmit}>
      <h2>📝 Register</h2>
      <input name="firstName" placeholder="First Name" required onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
      <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Register;
