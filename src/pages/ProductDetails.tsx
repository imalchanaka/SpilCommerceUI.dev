import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from './admin/api/ProductAPI';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // ... other product fields
}

export default function ProductDetails() {
  // Get the ID from the URL (e.g., `/ProductDetails/123`)
  //const { id } = useParams<{ id: string }>();

  // State to manage product data, loading, and errors
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const[id]=useState(56);
  // Fetch product data when the component mounts or `id` changes
  useEffect(() => {
    const fetchProduct = async () => {
        setIsLoading(true);
        const response = await getProductById(id);
    }

    console.log("fetchProduct",fetchProduct)
    
  }, []);

  return (
    <div className="product-details">
   
      <p>Descriptio</p>
      {/* Add more product fields as needed */}
    </div>
  );
}