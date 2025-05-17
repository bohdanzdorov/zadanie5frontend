import {Card} from "primereact/card";
import {Button} from "primereact/button";
import "../Styles/CenterMenu.css"
import boyWithMath from '../assets/boy_with_math.png'
import bulb from '../assets/bulb.png'

export const CenterMenu = () => {
    return (
        <>
            <Card className="card" title={<span>Welcome to Your Nerd Classes <img src={bulb} alt="Bulb" style={{width: "5%"}}/></span>}>
                <div className="menu-container">
                    <Button className="button" label="Create"/>
                    <Button className="button" label="History"/>
                    <Button className="button" label="Info"/>
                    <Button className="button" label="API Documentation"/>
                </div>
                <div className="hero-section">
                    <img src={boyWithMath} alt="Math Illustration" className="hero-img"/>
                </div>

            </Card>
        </>
    );
};