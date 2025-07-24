import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBasedRoute from "./utils/RoleBasedRoute";

import AdminLayout from "./pages/Components/AdminLayout";
import Dashboard from "./pages/Components/Dashboard";
import ProductList from "./pages/Components/ProductList";
import CreateProductPage from "./pages/Components/CreateProductPage";
import CreateCategory from "./pages/Components/CreateCategory";
import CategoryList from "./pages/Components/CategoryList";
import Unauthorized from "./pages/Unauthorized";
import PageNotFound from "./pages/PageNotFound"; 

function Home() {
  return <h2>Welcome to Ecommerce!</h2>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
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
