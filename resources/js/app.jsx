import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from "./pages/Home";
import CreateProduct from "./pages/admin/CreateProduct";
import ProductVariants from "./pages/admin/ProductVariants";
import AdminProducts from "./pages/admin/AdminProducts";
import EditProduct from "./pages/admin/products/EditProduct";
import EditVariants from "./pages/admin/products/EditVariants";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";
import Order from "./pages/Order";
import OrderTracking from "./pages/OrderTracking";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";
import AdminVariants from "./pages/admin/AdminVariants";
import AdminOrders from "./pages/admin/AdminOrders";

function NonHomeLayout() {
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route element={<NonHomeLayout />}>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/:slug/:sku" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/create" element={<CreateProduct />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            <Route path="/admin/products/:id/variants" element={<ProductVariants />} />
            <Route path="/admin/products/:id/variants/edit" element={<EditVariants />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/variants" element={<AdminVariants />} /> 
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
