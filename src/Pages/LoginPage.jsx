import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AuthPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password
      });

      // Store token and role in localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.user.role);

      // Redirect to main page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card title="Login" className="auth-card">
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-100"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              required
              className="w-100"
            />
          </div>

          <Button
            type="submit"
            label={loading ? "Logging in..." : "Login"}
            disabled={loading}
            className="auth-button"
          />

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}