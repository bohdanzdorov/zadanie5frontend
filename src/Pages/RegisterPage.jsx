import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AuthPages.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
        language
      });

      // Some APIs return the token immediately after registration
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("role", response.data.user.role);
        navigate("/");
      } else {
        // Otherwise redirect to login page
        navigate("/login", {
          state: { message: "Registration successful! Please login." }
        });
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(", "));
      } else {
        setError(
          err.response?.data?.message ||
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card title="Register" className="auth-card">
        <form onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}

          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-100"
            />
          </div>

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
                required
                className="w-100"
            />
          </div>

          <div className="field">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <Password
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                toggleMask
                feedback={false}
                required
                className="w-100"
            />
          </div>
          <div className="field">
            <label htmlFor="language">Language</label>
            <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-100"
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da'}}
            >
              <option value="en">English</option>
              <option value="sk">Slovak</option>
            </select>
          </div>

          <Button
              type="submit"
              label={loading ? "Registering..." : "Register"}
              disabled={loading}
              className="auth-button"
          />

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}