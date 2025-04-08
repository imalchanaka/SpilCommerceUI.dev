import React, { useState, useEffect, useRef  } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import ProductForm from "../../components/ProductForm";
import { Product, ProductFormData } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";

import { Toast } from "primereact/toast";
                


import {
  createProduct,
  updateProduct,
  DeleteProduct,
  getProductById,
} from "../../pages/admin/api/ProductAPI";


const Products = () => {

  const toast = useRef<Toast>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

// Initialize state with localStorage value
const [addedProductCount, setAddedProductCount] = useState(() => {
  const saved = localStorage.getItem('addedProductCount');
  return saved ? parseInt(saved) : 0;
});
  useEffect(() => {
    dispatch(fetchProducts());
    localStorage.setItem('addedProductCount', addedProductCount.toString());
  }, [dispatch,addedProductCount]);

  console.log("yuuu",addedProductCount);

  //   try {
  //     const response = await fetch('http://localhost:5289/api/Product', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to add product');
  //     }
  //     dispatch(fetchProducts()); // Refresh the list
  //     setShowForm(false);
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     alert('Failed to add product. Please try again.');
  //   }
  // };

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const response = await createProduct(data);

      if (!response.isOk) {
        throw new Error(response.message || "Failed to add product");
      }
      else{
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Product Add successfully",
          life: 5000,
        });
      }
    setTimeout(() => {
      dispatch(fetchProducts()); 
      setShowForm(false);
      setAddedProductCount(prev => prev + 1); 
    }, 1000);
     
   
      
    } catch (error) {
      console.error("Error adding product:", error);
      //alert(error.message || 'Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
      
      // First fetch the latest data from the database
      const currentProduct = await getProductById(editingProduct.id);

      // Merge the existing data with the new changes
      const updatedData = {
        ...currentProduct,
        ...data,
        id: editingProduct.id,
      };

      const response = await updateProduct(editingProduct.id, updatedData);

      if (!response.isOk) {
        throw new Error(response.message || "Failed to update product");
      } else {
        
        toast.current?.show({
          severity: "warn",
          summary: "Success",
          detail: "Product Update successfully",
          life: 5000,
        });

        setTimeout(() => {
          dispatch(fetchProducts());
          setShowForm(false);
          setEditingProduct(null);
        }, 1000); // 100ms delay to ensure toast appears
      }

      
      // Optional success message
    
    
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update product"
      );
    }
  };

 
  

  const handleDeleteProduct = async (id: string) => {
    try {
      // Show confirmation dialog
      const confirmDelete = await new Promise((resolve) => {
        toast.current?.show({
          severity: 'warn',
          summary: 'Confirm Delete',
          detail: 'Are you sure you want to delete this product?',
          life: 0, // Persistent until manually closed
          sticky: true,
          content: (
            <div className="flex flex-col gap-2">
              <div className="text-sm">{'Are you sure you want to delete this product'}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                  onClick={() => {
                    toast.current?.clear();
                    resolve(true);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  className="p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    toast.current?.clear();
                    resolve(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        });
      });
  
      if (!confirmDelete) return;
  
      // Show processing toast
      toast.current?.show({
        severity: 'info',
        summary: 'Processing',
        detail: 'Deleting product...',
        life: 3000 // Persistent until manually closed
      });
  
      const response = await DeleteProduct(id);
  
      if (!response.isOk) {
        let errorMessage = response.message || "Validation failed";
        if (response.data?.errors) {
          errorMessage += ":\n";
          for (const [field, errors] of Object.entries(response.data.errors)) {
            errorMessage += `• ${field}: ${(errors as string[]).join(", ")}\n`;
          }
        }
        throw new Error(errorMessage);
      }
  
      // Clear current toast and show success
   
  
      // Refresh product list after a small delay
      setTimeout(() => {
        dispatch(fetchProducts());
      }, 100);
  
    } catch (error) {
      toast.current?.clear();
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error instanceof Error ? error.message : "Failed to delete product",
        life: 5000,
      });
    }
  };







  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <Toast ref={toast} position="top-right" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
              className="w-full py-2 pl-10 pr-4 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="divide-y">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex items-center p-6">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-16 h-16 rounded-md"
              />
              <div className="flex-1 ml-6">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="mr-6 text-right">
                <p className="font-semibold">Stock</p>
                <p
                  className={`${
                    product.stock < 10 ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
              <div className="flex space-x-2">
                {/* <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  <Pencil className="w-5 h-5" />
                </button> */}

                <button
                  onClick={async () => {
                    const productData = await getProductById(product.id);
                    setEditingProduct(product);
                  }}
                  className="p-2 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-red-500 rounded-md hover:bg-red-50"
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
          title={editingProduct ? "Edit Product" : "Add New Product"}
        />
      )}
    </div>
  );
};

export default Products;
