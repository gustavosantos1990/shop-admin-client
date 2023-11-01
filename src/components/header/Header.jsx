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
            icon: "pi pi-fw pi-shopping-bag",
            command: () => navigate({ to: "/pedidos", replace: true })
        },
        {
            label: "Produtos",
            icon: "pi pi-fw pi-gift",
            command: () => navigate({ to: "/produtos", replace: true })
        },
        {
            label: 'Componentes',
            icon: 'pi pi-fw pi-th-large'
        },
        {
            label: "Agenda",
            icon: "pi pi-fw pi-calendar",
            command: () => navigate({ to: "/agenda", replace: true })
        },
        {
            label: "Movimentações",
            icon: "pi pi-fw pi-money-bill",
            command: () => navigate({ to: "/agenda", replace: true })
        },
        {
            label: "Compras",
            icon: "pi pi-fw pi-shopping-cart",
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