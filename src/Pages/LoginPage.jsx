import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AuthPages.css";
import { useTranslation } from 'react-i18next';
import BackButton from "../Components/BackButton.jsx";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
        t('login.errorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="main-div">
        <BackButton/>
        <div className="auth-container">

          <Card title={t('login.operation')} className="auth-card">
            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}

              <div className="field">
                <label htmlFor="email">{t('registration.email')}</label>
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
                <label htmlFor="password">{t('registration.password')}</label>
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
                  label={loading ? t('login.loggingIn') : t('login.login')}
                  disabled={loading}
                  className="auth-button"
              />

              <div className="auth-footer">
                {t('login.additionalLabel')} <Link to="/register">{t('menu.authButtons.register')}</Link>
              </div>
            </form>
          </Card>
        </div>
      </div>

  );
}