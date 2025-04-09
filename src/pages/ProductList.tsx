import React, { useState, useEffect } from 'react';
import { Link, Search } from 'lucide-react';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productSlice';
import { useNavigate } from "react-router-dom";
import { getProductById } from './admin/api/ProductAPI';
import { Product} from "../types";


const ProductList = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [getProduct, setGetProduct] = useState<Product | null>(null);

  const navigate = useNavigate();
  const handleClick = async(id: string) => {
    try {
     // const productDetails = await getProductById(getProduct.id);
      
      // Option 1: Save to state manager (e.g., Redux, Context) if needed later
      // dispatch(setSelectedProduct(productDetails));

      // Option 2: Or pass via navigation state
      navigate(`/ProductDetails/${id}`);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };



  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const getProductQuantity = (productId: string): number => {
    const cartItem = cartItems.find((item: any) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

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

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(product => {
          const quantity = getProductQuantity(product.id);
          return (
            <div key={product.id} className="overflow-hidden bg-white rounded-lg shadow-md" onClick={() => handleClick(product.id)}>
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
                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <>
                        <button
                          onClick={() => dispatch(updateQuantity({
                            productId: product.id,
                            quantity: quantity - 1
                          }))}
                          className="flex items-center justify-center w-8 h-8 border rounded-md"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium">{quantity}</span>
                      </>
                    )}
                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className={`px-4 py-2 text-white rounded-md ${
                        quantity > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {quantity > 0 ? 'Add More' : 'Add to Cart'}
                    </button>
                    {quantity > 0 && (
                      <button
                        onClick={() => dispatch(updateQuantity({
                          productId: product.id,
                          quantity: quantity + 1
                        }))}
                        className="flex items-center justify-center w-8 h-8 border rounded-md"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;