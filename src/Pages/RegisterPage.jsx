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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== passwordConfirm) {
      setError(t('registration.passwordNotMatch'));
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
          state: { message: t('registration.successMessage') }
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
            t('registration.errorMessage')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="main-div">
        <BackButton/>
        <div className="auth-container">
          <Card title={t('registration.operation')} className="auth-card">
            <form onSubmit={handleRegister}>
              {error && <div className="error-message">{error}</div>}

              <div className="field">
                <label htmlFor="name">{t('registration.name')}</label>
                <InputText
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-100"
                />
              </div>

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
                    required
                    className="w-100"
                    feedback={true}
                    promptLabel={t('registration.enterPassword')}
                    weakLabel={t('registration.passwordStrength.weak')}
                    mediumLabel={t('registration.passwordStrength.medium')}
                    strongLabel={t('registration.passwordStrength.strong')}
                />
              </div>

              <div className="field">
                <label htmlFor="passwordConfirm">{t('registration.confirmPassword')}</label>
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
              {/*<div className="field">*/}
              {/*  <label htmlFor="language">{t('registration.language.name')}</label>*/}
              {/*  <select*/}
              {/*      id="language"*/}
              {/*      value={language}*/}
              {/*      onChange={(e) => setLanguage(e.target.value)}*/}
              {/*      className="w-100"*/}
              {/*      style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da'}}*/}
              {/*  >*/}
              {/*    <option value="en">{t('registration.language.english')}</option>*/}
              {/*    <option value="sk">{t('registration.language.slovak')}</option>*/}
              {/*  </select>*/}
              {/*</div>*/}
              <div className="field">
                <label htmlFor="language">{t('registration.language.name')}</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-100 green-select"
                >
                  <option value="en">{t('registration.language.english')}</option>
                  <option value="sk">{t('registration.language.slovak')}</option>
                </select>
              </div>


              <Button
                  type="submit"
                  label={loading ? t('registration.registering') : t('registration.register')}
                  disabled={loading}
                  className="auth-button"
              />

              <div className="auth-footer">
                {t('registration.additionalLabel')} <Link to="/login"> {t('menu.authButtons.login')}</Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
  );
}