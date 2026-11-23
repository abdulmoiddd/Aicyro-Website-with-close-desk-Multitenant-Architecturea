import React, { useState } from "react";
import { useRouter } from "next/router";
import { LogIn, CircleAlert } from "lucide-react";

// --- FIREBASE IMPORTS ---
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase12";

// --- COMPONENTS ---
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Hallmark redesign: a plain sign-in panel in the kit. The lookup, the session
// flag and the redirect are unchanged.
const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Reference the 'login' node in your database
      const loginRef = ref(database, "login");

      // 2. Fetch the data once
      const snapshot = await get(loginRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();

        // 3. Convert object to array and find a matching user
        // The schema is: "1": { name: "root", password: "admin" }, ...
        const userFound = Object.values(usersData).find(
          (user) => user.name === username && user.password === password,
        );

        if (userFound) {
          // 4. LOGIN SUCCESS: Save a simple session flag
          // Note: In a real production app, use secure tokens. This is a simple client-side check.
          localStorage.setItem("aicyro_admin_user", JSON.stringify(userFound));
          router.push("/messages");
        } else {
          // Password or Username didn't match
          setError("Invalid username or password.");
        }
      } else {
        setError("System error: Login data not found.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Failed to connect to the database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main id="main" className="ax-container rs-auth">
        <div className="ax-panel">
          {/* Header */}
          <div className="grid gap-2">
            <h1 className="ax-h1--s">Admin Login</h1>
            <p className="ax-meta">Enter your database credentials</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="grid gap-5">
            {/* Username Input */}
            <div className="ax-field">
              <label htmlFor="mes-username" className="ax-label">
                Username
              </label>
              <input
                id="mes-username"
                type="text"
                required
                autoComplete="username"
                className="ax-input"
                aria-invalid={error ? true : undefined}
                aria-describedby="mes-error"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="ax-field">
              <label htmlFor="mes-password" className="ax-label">
                Password
              </label>
              <input
                id="mes-password"
                type="password"
                required
                autoComplete="current-password"
                className="ax-input"
                aria-invalid={error ? true : undefined}
                aria-describedby="mes-error"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            <p id="mes-error" className="ax-help ax-help--error flex items-center gap-2" role="alert">
              {error && <CircleAlert size={16} aria-hidden="true" />}
              {error}
            </p>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="ax-btn ax-btn--block"
            >
              {loading ? (
                <span className="rs-spinner" aria-hidden="true" />
              ) : (
                <LogIn size={18} aria-hidden="true" />
              )}
              <span>Sign In</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
