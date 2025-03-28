import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import ProductForm from '../../components/ProductForm';
import { Product, ProductFormData } from '../../types';
import { productData } from './data';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock data - replace with API calls
  const [products, setProducts] = useState<Product[]>(productData
  //   [
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
  // ]
);

  const handleAddProduct = (data: ProductFormData) => {
    // Mock API call - replace with actual API
    const newProduct: Product = {
      id: Date.now().toString(),
      ...data,
    };
    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!editingProduct) return;
    
    // Mock API call - replace with actual API
    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? { ...product, ...data } : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    // Mock API call - replace with actual API
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="divide-y">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-6 flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 ml-6">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-gray-500 text-sm">{product.description}</p>
              </div>
              <div className="text-right mr-6">
                <p className="font-semibold">Stock</p>
                <p className={`${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                  {product.stock} units
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showForm || editingProduct) && (
        <ProductForm
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          initialData={editingProduct || undefined}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
        />
      )}
    </div>
  );
};

export default Products;