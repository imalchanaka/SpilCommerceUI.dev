import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllOders, getProducts } from "../admin/api/ProductAPI";
import { fetchProducts } from "../../store/slices/productSlice";

// Define types for API response and orders
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  // Add other properties your API response might have
}

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  dateEntered: string;
  status?: string;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

const Dashboard = () => {
  
  const { products } = useAppSelector((state) => state.products);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: products.length,
    totalUsers: 2,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  

useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    
    const fetchOrders = async () => {

      try {
    
        const response = await getAllOders() as unknown as ApiResponse<Order[]>;
        console.log("Orders response:", response);
        
        // Access the data property of the ApiResponse
        const ordersData = response.data || [];
        
        // Transform API data to match our UI needs
        const formattedOrders = ordersData.map((order) => ({
          id: order.id,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          dateEntered: new Date(order.dateEntered).toLocaleDateString(),
          status: order.status || "completed"
        }));

        setOrders(formattedOrders);
        
        // Calculate statistics from the orders data
        const totalSales = ordersData.reduce(
          (sum, order) => sum + order.totalAmount, 
          0
        );
        
        setStats({
          totalSales,
          totalOrders: ordersData.length,
          totalProducts: products.length,
          totalUsers: 2, // You might want to fetch this from API
        });
        
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [products.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-lg font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  // Get recent orders (last 5), sorted by date
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">
                ${stats.totalSales.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>12% increase</span>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-4 text-sm text-blue-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>24 this week</span>
          </div>
        </div>

        {/* Products Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
          <Link
            to="/admin/products"
            className="flex items-center mt-4 text-sm text-purple-500"
          >
            Manage products →
          </Link>
        </div>

        {/* Users Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
          <Link
            to="/admin/users"
            className="flex items-center mt-4 text-sm text-orange-500"
          >
            View all users →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.dateEntered}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No recent orders found
            </div>
          )}
        </div>
        <div className="p-6 border-t">
          <Link
            to="/admin/orders"
            className="text-blue-500 hover:text-blue-600"
          >
            View all orders →
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;