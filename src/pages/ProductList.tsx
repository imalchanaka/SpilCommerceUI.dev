import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productSlice';
import { Product } from '../types';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4 space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="overflow-hidden bg-white rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
              <p className="mb-4 text-gray-600">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">${product.price}</span>
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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