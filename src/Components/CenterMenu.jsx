import {Card} from "primereact/card";
import {Button} from "primereact/button";
import "../Styles/CenterMenu.css";
import boyWithMath from '../assets/boy_with_math.png';
import bulb from '../assets/bulb.png';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const CenterMenu = () => {
    const [userState, setUserState] = useState("guest");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and their role
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token) {
            setUserState("guest");
        } else if (userRole === "admin") {
            setUserState("admin");
        } else {
            setUserState("user");
        }
    }, []);

    const downloadManual = () => {
        const link = document.createElement('a');
        link.href = 'http://127.0.0.1:8000/api/manual/pdf';
        link.download = 'manual.pdf';
        link.target = '_blank';
        link.click();
    };

    const handleStartTest = () => {
        navigate('/test');
    };

    const handleHistory = () => {
        navigate('/history');
    };

    const handleAdminDashboard = () => {
        navigate('/admin');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const renderMenuButtons = () => {
        switch (userState) {
            case "admin":
                return (
                    <>
                        <Button className="button" onClick={handleAdminDashboard} label="Admin Dashboard"
                                icon="pi pi-cog"/>
                        <Button className="button" onClick={handleHistory} label="Test History" icon="pi pi-history"/>
                        <Button className="button" onClick={downloadManual} label="Download Manual"
                                icon="pi pi-download"/>
                    </>
                );
            case "user":
                return (
                    <>
                        <Button className="button" onClick={handleStartTest} label="New Test" icon="pi pi-play"/>
                        <Button className="button" onClick={handleProfile} label="Profile" icon="pi pi-user"/>
                        <Button className="button" label="Info" icon="pi pi-info-circle"/>
                        <Button className="button" label="API Documentation" icon="pi pi-history"/>
                        <Button className="button" onClick={downloadManual} label="Download Manual"
                                icon="pi pi-download"/>
                    </>
                );
            default: // guest
                return (
                    <>
                        <Button className="button" onClick={handleStartTest} label="Try a Test" icon="pi pi-play"/>
                        <Button className="button" onClick={handleLogin} label="Log In" icon="pi pi-sign-in"/>
                        <Button className="button" onClick={handleRegister} label="Register" icon="pi pi-user-plus"/>
                        <Button className="button" label="Info" icon="pi pi-info-circle"/>
                        <Button className="button" onClick={downloadManual} label="Download Manual"
                                icon="pi pi-download"/>
                    </>
                );
        }
    };

    return (
        <>
            <Card className="card"
                  title={<span>Welcome to Your Nerd Classes <img src={bulb} alt="Bulb" style={{width: "5%"}}/></span>}>
                <div className="menu-container">
                    {renderMenuButtons()}
                </div>
                <div className="hero-section">
                    <img src={boyWithMath} alt="Math Illustration" className="hero-img"/>
                </div>
            </Card>
        </>
    );
};