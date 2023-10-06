import React, { useEffect } from 'react'
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-location';
import './Header.css';

export default function Header() {

    const navigate = useNavigate();

    const items = [
        {
            label: "Home",
            icon: "pi pi-fw pi-home",
            command: () => navigate({ to: "/", replace: true })
        },
        {
            label: "Componentes",
            icon: "pi pi-fw pi-money-bill",
            command: () => navigate({ to: "/componentes", replace: true })
        }
    ];

    useEffect(() => {
        console.log("starting Header");
      });
    

    return (
        <header>
            <Menubar model={items} />
        </header>
    );
}