import './App.css'
import { Routes, Route } from 'react-router-dom'
import MenuPage from './Pages/MenuPage.jsx'
import {TestPage} from './Pages/TestPage.jsx'
import HistoryPage from './Pages/HistoryPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import LogoutPage from './Pages/LogoutPage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import ProfilePage from "./Pages/ProfilePage.jsx";
import AdminProfilePage from "./Pages/AdminProfilePage.jsx";
import axios from 'axios';
import { ensureGuestId } from './utils/guestUser';

function App() {
    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Only add guest ID if no auth token exists
            config.headers['X-Guest-ID'] = ensureGuestId();
        }

        return config;
    });
    return (
        <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminProfilePage />} />
        </Routes>
    )
}



export default App