// client/src/pages/Login.jsx

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserContext from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1) Your regular login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      console.log("🔑 login response:", data);
      login({ user: data.user, token: data.token });
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  };

  // 2) Your Google OAuth redirect
  const handleGoogleLogin = () => {
    // adjust to your backend’s Google OAuth route
    window.open("http://localhost:4000/auth/google", "_self");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-3">Login to CampusPulse</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@osu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-end mb-3">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-warning w-100 text-white mb-2">
          Login
        </button>
      </form>

      {/* Google login */}
      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline-danger w-100 mb-3"
      >
        {/* If you have Bootstrap icons installed */}
        <i className="bi bi-google me-2"></i> Login with Google
      </button>

      <div className="text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-decoration-none text-warning fw-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
