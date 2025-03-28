import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-blue-500 hover:text-blue-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center py-6 border-b last:border-b-0">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            
            <div className="flex-1 ml-6">
              <h3 className="text-lg font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => dispatch(removeFromCart(item.product.id))}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between text-xl font-semibold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-3 text-gray-600 hover:text-gray-800"
            >
              Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;