import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBasedRoute from "./utils/RoleBasedRoute";

import AdminLayout from "./pages/Components/admin/AdminLayout";
import Dashboard from "./pages/Components/admin/Dashboard";
import ProductList from "./pages/Components/admin/ProductList";
import CreateProductPage from "./pages/Components/admin/CreateProductPage";
import CreateCategory from "./pages/Components/admin/CreateCategory";
import CategoryList from "./pages/Components/admin/CategoryList";
import LandingPage from "./pages/Components/LandingPage";
import ProductDetail from "./pages/Components/ProductDetail";
import CartPage from "./pages/Components/CartPage";
import PlaceOrderPage from "./pages/Components/PlaceOrderPage";
import OrderList from "./pages/Components/OrderList";
import Unauthorized from "./pages/Unauthorized";
import PageNotFound from "./pages/PageNotFound";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/orders" element={<OrderList />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <LandingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <ProductDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <PlaceOrderPage />
          </PrivateRoute>
        }
      />


      {/* Admin-only Routes */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRole="admin">
            <AdminLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CreateCategory />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* 404 Page Not Found Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
