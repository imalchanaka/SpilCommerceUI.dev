import React, { useEffect, useState } from "react";
import { Search, FileText, Filter, X } from "lucide-react";
import { getAllOders, updateStatusOrder } from "../admin/api/ProductAPI";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items: OrderItem[];
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOders();
        const transformedOrders = response.data.map((apiOrder: any) => ({
          id: apiOrder.id,
          customer: apiOrder.customerName,
          email: apiOrder.email,
          total: apiOrder.totalAmount,
          status: apiOrder.status,
          date: new Date(apiOrder.dateEntered).toISOString().split('T')[0],
          items: apiOrder.orderItems || []
        }));
        setOrders(transformedOrders);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  const handleResendInvoice = (orderId: number) => {
    console.log("Resending invoice for order:", orderId);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
    setSelectedStatus("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) return;
  
    try {
      setLoading(true);
      // Call your API with a single object containing both properties
      await updateStatusOrder({
        orderId: selectedOrder.id,
        status: selectedStatus
      });
      
      // Update the local orders state to reflect the change
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: selectedStatus } 
          : order
      ));
      
      // Close the popup
      closePopup();
    } catch (err) {
      setError("Failed to update order status");
      console.error("Error updating order status:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
    order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

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
                <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="divide-y">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => openOrderDetails(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">{order.customer}</p>
                    <p className="text-gray-500 text-sm">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">{order.date}</p>
                    <span
  className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
    order.status === "processing"
      ? "bg-yellow-100 text-yellow-800"  
    : order.status === "confirmed"
      ? "bg-blue-100 text-blue-800"     
    : order.status === "shipped"
      ? "bg-indigo-100 text-indigo-800" 
    : order.status === "on_hold"
      ? "bg-purple-100 text-purple-800"  
    : order.status === "completed"
      ? "bg-green-100 text-green-800"    
    : order.status === "cancelled"
      ? "bg-red-100 text-red-800"       
    : "bg-gray-100 text-gray-800"       
  }`}
>
  {order.status}
</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="text-gray-600">
                        {item.productName} = (Unit {item.quantity}x Price ${item.unitPrice.toFixed(2)})
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No items in this order</div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResendInvoice(order.id);
                  }}
                  className="flex items-center text-blue-500 hover:text-blue-600"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Resend Invoice
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No orders found</div>
        )}
      </div>

      {/* Order Details Popup */}
      {showPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button 
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                    <p><span className="font-medium">Date:</span> {selectedOrder.date}</p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Status:</span> 
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="pl-3 pr-4 py-1 border rounded-lg appearance-none bg-white"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </p>
                    <p><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleStatusUpdate}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change the Status"}
                </button>
                
                <button
                  onClick={closePopup}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;