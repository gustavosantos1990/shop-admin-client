import React, { useEffect } from 'react'
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-location';
import './Header.css';

export default function Header() {

    const navigate = useNavigate();

    const items = [
        {
            icon: "fa-solid fa-house-chimney",
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
            icon: 'pi pi-fw pi-th-large',
            command: () => navigate({ to: "/componentes", replace: true })
        },
        {
            label: "Agenda",
            icon: "fa-regular fa-calendar",
            command: () => navigate({ to: "/agenda", replace: true })
        },
        {
            label: "Movimentações",
            icon: "fa-solid fa-money-bill-wave",
            command: () => navigate({ to: "/agenda", replace: true })
        },
        {
            label: "Compras",
            icon: "fa-solid fa-cart-shopping",
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