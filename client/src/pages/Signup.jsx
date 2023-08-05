import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Error creating account. Try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:4000/auth/google", "_self"); // adjust for your backend
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-3">Sign Up for CampusPulse</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Pistol Pete"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-3">
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
        <button type="submit" className="btn btn-warning w-100 text-white mb-2">
          Sign Up
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline-danger w-100 mb-3"
      >
        <i className="bi bi-google me-2"></i> Sign Up with Google
      </button>

      <div className="text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-decoration-none text-warning fw-semibold">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
