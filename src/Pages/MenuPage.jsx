import {useState, useEffect} from "react";
import {CenterMenu} from "../Components/CenterMenu.jsx";
import "../Styles/Menu.css"
import Navigation from "../Components/Navigation.jsx";
import BackButton from "../Components/BackButton.jsx";

export default function MenuPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="menu-page">
            <Navigation loggedIn={isLoggedIn} />
            <CenterMenu />
        </div>
    );
}
