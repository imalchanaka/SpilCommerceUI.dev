import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import { productData } from './admin/data';

// Mock data - replace with actual API call
const mockProducts: Product[] = productData;
// [
//   {
//     id: '1',
//     name: 'Modern Desk Lamp',
//     description: 'Sleek LED desk lamp with adjustable brightness',
//     price: 49.99,
//     stock: 50,
//     image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     id: '2',
//     name: 'Wireless Keyboard',
//     description: 'Ergonomic wireless keyboard with backlight',
//     price: 79.99,
//     stock: 30,
//     image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
//   },
// ];

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => {
      if (priceFilter === 'under50') return product.price < 50;
      if (priceFilter === '50to100') return product.price >= 50 && product.price <= 100;
      if (priceFilter === 'over100') return product.price > 100;
      return true;
    });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            className="border rounded-lg px-4 py-2"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="over100">Over $100</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">${product.price}</span>
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;