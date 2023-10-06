/*
import React from "react";
import { ReactLocation } from "react-location";
import { getComponents } from "../services/ComponentService";

export const routes = [
    {
        path: "/",
        element: () => import("../pages/home/Home").then(module => <module.default />)
    },
    {
        path: "componentes",
        element: () => import("../pages/components/Components").then(module => <module.default />),
        loader: async () => {
            return { purchases: await getComponents() }
        }
    }
];

export const location = new ReactLocation();
*/