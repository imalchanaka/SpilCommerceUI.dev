import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import LoginForm from "./components/LoginForm";
import "primereact/resources/themes/lara-light-blue/theme.css";
import SalesOrderUI from "./pages/SalesOrderUI";
import Contact from "./pages/contact.tsx";
import AboutUs from "./pages/About.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";

const PrivateRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
// Create a new component that will use useLocation
const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <div className="container px-4 py-8 mx-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<ProductList />} />
          <Route path="/salesOrder" element={<SalesOrderUI />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
         
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          {/* Protected User Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute requireAdmin>
                <AdminProducts />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRoute requireAdmin>
                <AdminOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requireAdmin>
                <AdminUsers />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};



export default App;