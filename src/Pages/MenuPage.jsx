import {useState} from "react";
import {CenterMenu} from "../Components/CenterMenu.jsx";
import "../Styles/Menu.css"
import Navigation from "../Components/Navigation.jsx";

export default function MenuPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            <Navigation />
            <CenterMenu />
        </div>
    );
}
