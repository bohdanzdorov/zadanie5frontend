import {Card} from "primereact/card";
import {Button} from "primereact/button";
import "../Styles/CenterMenu.css"
import boyWithMath from '../assets/boy_with_math.png'
import bulb from '../assets/bulb.png'
import {loginAsAdmin} from "../App.jsx";
import { useNavigate } from 'react-router-dom';

export const CenterMenu = () => {
    const downloadManual = () => {
        const link = document.createElement('a');
        link.href = 'http://127.0.0.1:8000/api/manual/pdf';
        link.download = 'manual.pdf';
        link.target = '_blank';
        link.click();
    };

    const navigate = useNavigate();

    const handleStartTest = () => {
        navigate('/test');
    };

    return ( //TODO ХАРДКОД!! - убрать кнопку логин ас админ когда будет готова авторизация
        <>
            <Card className="card" title={<span>Welcome to Your Nerd Classes <img src={bulb} alt="Bulb" style={{width: "5%"}}/></span>}>
                <div className="menu-container">
                    <Button className="button" onClick={handleStartTest} label="New Test" />
                    <Button className="button" label="History" />
                    <Button className="button" label="Info" />
                    <Button className="button" label="API Documentation" />
                    <Button className="button" onClick={downloadManual} label="Download Manual 📥" />
                    <Button className="button" onClick={loginAsAdmin} label="Login as Admin" />
                </div>
                <div className="hero-section">
                    <img src={boyWithMath} alt="Math Illustration" className="hero-img" />
                </div>
            </Card>
        </>
    );
};
