import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading flag
  const [isRegistering, setIsRegistering] = useState(false); // Toggle form

  // Listen for login/logout status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // ✅ done checking auth
    });
    return () => unsubscribe(); // clean up
  }, []);

  if (loading) {
    return <div>Loading authentication...</div>; // ✅ waiting screen
  }

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
