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

function App() {

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

//TODO пока не готова часть с авторизацией - это хардкод авторизация для получения админ прав
export async function loginAsAdmin() {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin2@example.com",
                password: "admin123"
            }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.user.role);

        alert("✅ Logged in as admin!");
    } catch (e) {
        alert("❌ Login failed");
        console.error(e);
    }
}


export default App