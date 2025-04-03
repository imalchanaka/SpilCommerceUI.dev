import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
//import { productData } from "./data";

const Dashboard = () => {
  // Mock data - replace with API calls
  const stats = {
    totalSales: 15789.45,
    totalOrders: 156,
  //  totalProducts: productData.length,
    totalUsers: 2,
  };

  const recentOrders = [
    {
      id: "1",
      customer: "John Doe",
      total: 129.99,
      status: "completed",
      date: "2024-03-15",
    },
    {
      id: "2",
      customer: "Jane Smith",
      total: 89.99,
      status: "pending",
      date: "2024-03-14",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">
                ${stats.totalSales.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>12% increase</span>
          </div>
        </div>

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

        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products</p>
              {/* <p className="text-2xl font-bold">{stats.totalProducts}</p> */}
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

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-6"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
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
          ))}
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
