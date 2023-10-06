import React, { useEffect } from 'react'
import './App.css'
import { Router, ReactLocation } from "react-location";
import { getComponents } from "../../services/ComponentService";
import Footer from '../footer/Footer'
import Header from '../header/Header'
import Main from '../main/Main'

export default function App() {

  const routes = [
    {
        path: "/",
        element: () => import("../../pages/home/Home").then(module => <module.default />)
    },
    {
        path: "componentes",
        element: () => import("../../pages/components/Components").then(module => <module.default />),
        loader: async () => {
          var res = await getComponents();
          var json = await res.json();
          return { components: json.content };
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
      <Main />
      <Footer />
    </Router>
  )
};