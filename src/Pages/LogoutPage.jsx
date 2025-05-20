import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {Card} from "primereact/card";
import "../Styles/AuthPages.css";

export default function LogoutPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const performLogout = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // No token found, just redirect
                navigate('/', {replace: true});
                return;
            }

            try {
                // Call the logout endpoint with proper JWT authentication
                await axios.post(`${API}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Clear authentication data
                localStorage.removeItem('token');
                localStorage.removeItem('role');

                // Redirect to home page
                navigate('/', {replace: true});
            } catch (err) {
                console.error("Logout error:", err);

                // Still clear local storage even if API call fails
                localStorage.removeItem('token');
                localStorage.removeItem('role');

                setError(t('logout.errorMessage'));

                // Redirect after a short delay to show the error
                setTimeout(() => {
                    navigate('/', {replace: true});
                }, 2000);
            }
        };

        performLogout();
    }, [navigate, API]);

    if (error) {
        return (
            <div className="auth-container">
                <Card title={t('logout.operation')} className="auth-card">
                    <div className="error-message">{error}</div>
                    <p>{t('logout.textIfError')}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <Card title={t('logout.operation')} className="auth-card">
                <p>{t('logout.text')}</p>
            </Card>
        </div>
    );
}