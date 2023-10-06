import React from "react";
import { Outlet } from "react-location";
import './Main.css';

export default function Main() {
    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    );
};