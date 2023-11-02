import React, { useEffect } from 'react'
import './App.css'
import { Router, ReactLocation, Outlet } from "react-location";
import { getRequestByID, getRequests } from "../../services/RequestService";
import Footer from '../footer/Footer'
import Header from '../header/Header'
import { getProducts, getProductByID } from '../../services/ProductService';

export default function App() {

  useEffect(() => {
    console.log("starting App");
  });

  const fetchRequest = async id => {
    if ("novo" === id) return null;
    var res = await getRequestByID(id)
    return await res.json();
  };

  const fetchProducts = async () => {
    var res = await getProducts()
    return res.status === 204 ? [] : await res.json();
  };

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
            var json = res.status === 204 ? [] : await res.json();
            return { requests: json };
          }
        },
        {
          path: ":id",
          element: () => import("../../pages/requests/RequestForm").then(module => <module.default />),
          loader: async ({params}) => {
            return {
              request: await fetchRequest(params.id),
              products: await fetchProducts()
            }
          }
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
            var json = res.status === 204 ? [] : await res.json();
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
              var res = await getProductByID(params.id);
              return { product: await res.json() };
            }
          }
        }
      ]
    }
  ];

  const location = new ReactLocation();

  return (
    <Router routes={routes} location={location}>
      <Header />
      <Outlet />
      <Footer />
    </Router>
  )
};