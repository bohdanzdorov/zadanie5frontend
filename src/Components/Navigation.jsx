import { Menubar } from "primereact/menubar";
import "../Styles/Navigation.css";
import mathIcon from "../assets/mathematics.png";

export default function Navigation(props) {
    const role = localStorage.getItem('role'); // можно заменить на props.role
    const isAdmin = role === 'admin';

    const userMenu = [
        {
            icon: "pi pi-user",
            items: !props.loggedIn
                ? [
                    {
                        icon: "pi pi-sign-in",
                        label: "Log in",
                        url: "/login",
                        className: "user"
                    },
                    {
                        icon: "pi pi-user-plus",
                        label: "Register",
                        url: "/register",
                        className: "user"
                    }
                ]
                : [
                    {
                        icon: "pi pi-sign-out",
                        label: "Log out",
                        url: "/logout",
                        className: "user"
                    },
                    {
                        icon: "pi pi-user-edit",
                        label: "Profile",
                        url: isAdmin ? "/admin" : "/profile",
                        className: "user"
                    }
                ]
        },
        ...(isAdmin
            ? [{
                icon: "pi pi-chart-bar",
                label: "View Tests Statistics",
                url: "/history"
            },
                {
                    icon: "pi pi-users",
                    label: "Profile",
                    url: "/admin",
                }]
            : [])
    ];

    const start = (
        <span className="menu-title-item title">
            <img
                src={mathIcon}
                alt="Math icon"
                style={{ width: "2rem", marginRight: "0.5rem", verticalAlign: "middle" }}
            />
            Math Genius
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

