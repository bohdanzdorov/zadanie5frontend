import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Card} from "primereact/card";
import "../Styles/AuthPages.css";

export default function LogoutPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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

                setError("Logout failed on server but local session cleared");

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
                <Card title="Logging out" className="auth-card">
                    <div className="error-message">{error}</div>
                    <p>Redirecting to home page...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <Card title="Logging out" className="auth-card">
                <p>Please wait...</p>
            </Card>
        </div>
    );
}