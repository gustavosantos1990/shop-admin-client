import React, { useEffect } from 'react'
import './App.css'
import { Router, ReactLocation, Outlet } from "react-location";
import { getRequests } from "../../services/ComponentService";
import Footer from '../footer/Footer'
import Header from '../header/Header'

export default function App() {

  const routes = [
    {
      path: "/",
      element: () => import("../../pages/home/Home").then(module => <module.default />)
    },
    {
      path: "agenda",
      element: () => import("../../pages/agenda/Agenda").then(module => <module.default />)
    },
    {
      path: "pedidos",
      element: () => import("../../pages/requests/Requests").then(module => <module.default />),
      loader: async () => {
        var res = await getRequests();
        console.log(res);
        var json = await res.json();
        console.log(json);
        return { requests: json };
      }
    }
  ];

  const location = new ReactLocation()

  useEffect(() => {
    console.log("starting App");
  });

  return (
    <Router routes={routes} location={location}>
      <Header />
      <Outlet />
      <Footer />
    </Router>
  )
};