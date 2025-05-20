import { Menubar } from "primereact/menubar";
import "../Styles/Navigation.css";
import mathIcon from "../assets/mathematics.png";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function Navigation(props) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [fetched, setFetched] = useState(false);

    // ==== Fetch user's language preferences from backend ====
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            i18n.changeLanguage('en')
            return;
        }

        (async () => {
            try {
                const { data } = await axios.get(`${API}/language`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.language) {
                    i18n.changeLanguage(data.language);
                }
            } catch (err) {
                console.error("Could not fetch user language:", err);
            } finally {
                setFetched(true);
            }
        })();
    }, []);
    // ==== Update frontend and backend language ====
    const changeLang = async (lng) => {
        const token = localStorage.getItem("token");
        // optimistically switch UI
        i18n.changeLanguage(lng);

        if (token) {
            try {
                await axios.put(
                    `${API}/language`,
                    { language: lng },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.error("Failed to persist language:", err);
            }
        }
    };

    const currentLang = i18n.language.toUpperCase();

    const userMenu = [
        {
            icon: "pi pi-user",
            items: !props.loggedIn
                ? [
                    {
                        icon: "pi pi-sign-in",
                        label: t('menu.authButtons.login'),
                        url: "/login",
                        className: "user"
                    },
                    {
                        icon: "pi pi-user-plus",
                        label: t('menu.authButtons.register'),
                        url: "/register",
                        className: "user"
                    }
                ]
                : [
                    {
                        icon: "pi pi-sign-out",
                        label: t('menu.authButtons.logout'),
                        url: "/logout",
                        className: "user"
                    }
                ]
        },
        {
            icon: "pi pi-globe",
            label: currentLang,
            disabled: !fetched && !!localStorage.getItem("token"),
            items: [
                {
                    label: "EN 🇬🇧",
                    icon: currentLang === 'EN' ? 'pi pi-check-circle' : 'pi pi-circle',
                    command: () => changeLang('en')
                },
                {
                    label: "SK 🇸🇰",
                    icon: currentLang === 'SK' ? 'pi pi-check-circle' : 'pi pi-circle',
                    command: () => changeLang('sk')
                }
            ]
        }
    ];

    const start = (
        <span className="menu-title-item title">
      <img
          src={mathIcon}
          alt="Math icon"
          style={{ width: "2rem", marginRight: "0.5rem", verticalAlign: "middle" }}
      />
            {t('menu.title')}
    </span>
    );

    return (
        <Menubar
            className="custom-menubar"
            model={userMenu}
            start={start}
        />
    );
}
