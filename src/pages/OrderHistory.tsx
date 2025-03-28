import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FileText } from 'lucide-react';

const OrderHistory = () => {
  // Mock orders data - replace with API call
  const orders = [
    {
      id: '1',
      createdAt: '2024-03-15',
      total: 129.98,
      status: 'completed',
      items: [
        { product: { name: 'Modern Desk Lamp' }, quantity: 1 },
        { product: { name: 'Wireless Keyboard' }, quantity: 1 }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {orders.map((order) => (
          <div key={order.id} className="p-6 border-b last:border-b-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">{order.createdAt}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm capitalize bg-green-100 text-green-800">
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="text-gray-600">
                  {item.quantity}x {item.product.name}
                </div>
              ))}
            </div>
            
            <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Download Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;