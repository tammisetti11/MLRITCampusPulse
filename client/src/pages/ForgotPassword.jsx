import { useState } from "react";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Password reset link sent if email exists.");
    } catch (err) {
      setMessage("Error sending reset email.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-3">Forgot Password</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Enter your email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@osu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning w-100 text-white">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
