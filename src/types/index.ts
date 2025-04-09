import { numberToString } from "igniteui-react-core";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  categoryId: number; // Make this optional
}