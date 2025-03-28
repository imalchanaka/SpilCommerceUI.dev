import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, User } from "lucide-react";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Spil Online Store
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <button
                  onClick={() => handleLogoutClick()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleLoginClick()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
