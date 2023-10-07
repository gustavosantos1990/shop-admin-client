import React, { useEffect } from 'react'
import './App.css'
import { Router, ReactLocation, Outlet } from "react-location";
import { getRequests } from "../../services/ComponentService";
import Footer from '../footer/Footer'
import Header from '../header/Header'
import { getProducts, getProductsByID } from '../../services/ProductService';

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
      children: [
        {
          path: "/",
          element: () => import("../../pages/requests/Requests").then(module => <module.default />),
          loader: async () => {
            var res = await getRequests();
            console.log(res);
            var json = await res.json();
            console.log(json);
            return { requests: json };
          }
        },
        {
          path: ":id",
          element: () => import("../../pages/requests/Requests").then(module => <module.default />)
        }
      ]
    },
    {
      path: "produtos",
      children: [
        {
          path: "/",
          element: () => import("../../pages/products/Products").then(module => <module.default />),
          loader: async () => {
            var res = await getProducts();
            console.log(res);
            var json = await res.json();
            console.log(json);
            return { products: json };
          }
        },
        {
          path: ":id",
          element: () => import("../../pages/products/ProductForm").then(module => <module.default />),
          loader: async ({ params }) => {
            if ("novo" === params.id) {
              return { product: null };
            } else {
              var res = await getProductsByID(params.id);
              return { product: await res.json() };
            }
          }
        }
      ]
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