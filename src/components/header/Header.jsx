import React, { useEffect } from 'react'
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-location';
import './Header.css';

export default function Header() {

    const navigate = useNavigate();

    const items = [
        {
            icon: "pi pi-fw pi-home",
            command: () => navigate({ to: "/", replace: true })
        },
        {
            label: "Pedidos",
            icon: "pi pi-fw pi-money-bill",
            command: () => navigate({ to: "/pedidos", replace: true })
        },
        {
            label: "Agenda",
            icon: "pi pi-fw pi-calendar",
            command: () => navigate({ to: "/agenda", replace: true })
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