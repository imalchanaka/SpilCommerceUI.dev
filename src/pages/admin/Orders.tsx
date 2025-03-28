import React, { useState } from 'react';
import { Search, FileText, Filter } from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with API calls
  const orders = [
    {
      id: '1',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 129.99,
      status: 'completed',
      date: '2024-03-15',
      items: [
        { product: 'Modern Desk Lamp', quantity: 1 },
        { product: 'Wireless Keyboard', quantity: 1 }
      ]
    },
    {
      id: '2',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 89.99,
      status: 'pending',
      date: '2024-03-14',
      items: [
        { product: 'Wireless Keyboard', quantity: 1 }
      ]
    }
  ];

  const handleResendInvoice = (orderId: string) => {
    // Implement resend invoice logic
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="divide-y">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">{order.customer}</p>
                  <p className="text-gray-500 text-sm">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${order.total}</p>
                  <p className="text-gray-500 text-sm">{order.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-gray-600">
                    {item.quantity}x {item.product}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleResendInvoice(order.id)}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <FileText className="w-4 h-4 mr-2" />
                Resend Invoice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;