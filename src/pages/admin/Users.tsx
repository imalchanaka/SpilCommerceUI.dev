import React, { useState } from 'react';
import { Search, Mail, ShoppingBag } from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      joinDate: '2024-02-15',
      orderCount: 5,
      totalSpent: 649.95
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      joinDate: '2024-01-10',
      orderCount: 3,
      totalSpent: 269.97
    }
  ];

  const handleViewOrders = (userId: string) => {
    // Implement view orders logic
  };

  const handleSendEmail = (email: string) => {
    // Implement send email logic
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="divide-y">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    {user.name}
                    {user.role === 'admin' && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500 text-sm">Joined {user.joinDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{user.orderCount} orders</p>
                  <p className="text-gray-600">Total spent: ${user.totalSpent}</p>
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleViewOrders(user.id)}
                  className="flex items-center text-blue-500 hover:text-blue-600"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View Orders
                </button>
                <button
                  onClick={() => handleSendEmail(user.email)}
                  className="flex items-center text-green-500 hover:text-green-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;