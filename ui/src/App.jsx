import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";


function Home() {
  return <h2>Welcome to Ecommerce!</h2>;
}

function Home1() {
  return <h2>Welcome to Ecommerce1!</h2>;
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
      <Route
        path="/1"
        element={
          <PrivateRoute>
            <Home1 />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
