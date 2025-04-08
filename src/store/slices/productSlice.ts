import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { Product, Category } from "../../types";
import { getProducts, getCategories } from "../../pages/admin/api/ProductAPI"; // Add GetCategories import

interface ProductState {
  products: Product[];
  categories: Category[]; 
  loading: boolean;
  categoriesLoading: boolean; // Add separate loading state for categories
  error: string | null;
  categoriesError: string | null; // Add separate error state for categories
}

const initialState: ProductState = {
  products: [],
  categories: [], // Initialize categories array
  loading: false,
  categoriesLoading: false, // Initialize categories loading
  error: null,
  categoriesError: null, // Initialize categories error
};

// Your existing products thunk
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  const response = await getProducts();
  if (!response.isOk)
    return rejectWithValue(response.message || "Failed to fetch products");
  if (!response.data) return rejectWithValue("No products data received");
  return response.data;
});

// Add categories thunk
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("Product/GetCategories", async (_, { rejectWithValue }) => {
  const response = await getCategories();
  if (!response.isOk)
    return rejectWithValue(response.message || "Failed to fetch categories");
  if (!response.data) return rejectWithValue("No categories data received");
  console.log("issssss", response);
  return response.data;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Products reducers (your existing code)
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Categories reducers (new code)

      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError =
          action.error.message || "Failed to fetch categories";
      });
  },
});

// Add these selectors at the bottom of the file
export const selectAllCategories = (state: RootState) =>
  state.products.categories;
export const selectCategoriesLoading = (state: RootState) =>
  state.products.categoriesLoading;
export const selectCategoriesError = (state: RootState) =>
  state.products.categoriesError;

export default productSlice.reducer;
