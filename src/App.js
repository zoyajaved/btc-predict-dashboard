import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle form

  // Listen for login/logout status
  // App.js
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, setUser);
  return () => unsubscribe(); // clean up
}, []);


  // Not logged in: show login or register
  if (!user) {
    return (
      <div className="auth-container">
        {isRegistering ? (
          <>
            <Register />
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsRegistering(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login />
            <p>
              Don’t have an account?{" "}
              <button onClick={() => setIsRegistering(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Logged in: show dashboard
  return <Dashboard />;
}

export default App;
