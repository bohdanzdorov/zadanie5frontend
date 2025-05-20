import {Card} from "primereact/card";
import {Button} from "primereact/button";
import "../Styles/CenterMenu.css";
import boyWithMath from '../assets/boy_with_math.png';
import bulb from '../assets/bulb.png';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';

export const CenterMenu = () => {
    const [userState, setUserState] = useState("guest");
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

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
                        <Button className="button" onClick={handleAdminDashboard} label={t('menu.centerMenu.buttons.adminDashboard')}
                                icon="pi pi-cog"/>
                        <Button className="button" onClick={handleHistory} label={t('menu.centerMenu.buttons.testHistory')} icon="pi pi-history"/>
                        <Button className="button" onClick={downloadManual} label={t('menu.centerMenu.buttons.downloadManual')}
                                icon="pi pi-info-circle"/>
                    </>
                );
            case "user":
                return (
                    <>
                        <Button className="button" onClick={handleStartTest} label={t('menu.centerMenu.buttons.newTest')} icon="pi pi-play"/>
                        <Button className="button" onClick={handleProfile} label={t('menu.centerMenu.buttons.profile')} icon="pi pi-user"/>
                        <Button className="button" label={t('menu.centerMenu.buttons.apiDocumentation')} icon="pi pi-history"/>
                        <Button className="button" onClick={downloadManual} label={t('menu.centerMenu.buttons.downloadManual')}
                                icon="pi pi-info-circle"/>
                    </>
                );
            default: // guest
                return (
                    <>
                        <Button className="button" onClick={handleStartTest} label={t('menu.centerMenu.buttons.tryTest')} icon="pi pi-play"/>
                        {/*<Button className="button" onClick={handleLogin} label="Log In" icon="pi pi-sign-in"/>*/}
                        {/*<Button className="button" onClick={handleRegister} label="Register" icon="pi pi-user-plus"/>*/}
                        <Button className="button" onClick={downloadManual} label={t('menu.centerMenu.buttons.downloadManual')}
                                icon="pi pi-info-circle"/>
                    </>
                );
        }
    };

    return (
        <>
            <Card className="card"
                  title={<span>{t('menu.centerMenu.title')} <img src={bulb} alt="Bulb" style={{width: "5%"}}/></span>}>
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