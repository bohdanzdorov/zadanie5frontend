import {Menubar} from "primereact/menubar";

export default function Navigation() {
    const menuItems = [
        {
            label: "PSG Annotation",
            className: "menu-title-item title",
        },
        {
            label: "Guidelines",
            icon: "pi pi-info-circle",
            url: "/guidelines",
            className: "menu-icon-guidelines"
        },
        {
            label: "Swagger Docs",
            icon: "pi pi-book",
            url: "/swagger",
        },
    ];


    return (
        <>
            <Menubar model={menuItems}  className="custom-menubar" />
        </>
    );
}
