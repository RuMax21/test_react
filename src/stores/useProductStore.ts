import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Product, FilterType, ProductFormData } from "../types/product";

interface ProductState {
  products: Product[];
  likedProducts: string[];
  filter: FilterType;
  searchQuery: string;
  loading: boolean;
  error: string | null;

  setProducts: (products: Product[]) => void;
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleLike: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  filteredProducts: () => Product[];
  getProduct: (id: string) => Product | undefined;
}

export const useProductsStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      likedProducts: [],
      filter: "all",
      searchQuery: "",
      loading: false,
      error: null,

      setProducts: (products) => {
        const { likedProducts } = get();
        set({
          products: products.map((p) => ({
            ...p,
            isLiked: likedProducts.includes(p.id),
          })),
        });
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: uuidv4(),
          rating: 0,
          discountPercentage: 0,
          stock: 0,
          images: [productData.thumbnail],
          createAt: new Date(),
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...productData } : product,
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          likedProducts: state.likedProducts.filter(
            (productId) => productId !== id,
          ),
        }));
      },

      toggleLike: (id) => {
        set((state) => {
          const isLiked = state.likedProducts.includes(id);
          const likedProducts = isLiked
            ? state.likedProducts.filter((productId) => productId !== id)
            : [...state.likedProducts, id];

          return {
            likedProducts,
            products: state.products.map((product) =>
              product.id === id ? { ...product, isLiked: !isLiked } : product,
            ),
          };
        });
      },

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      filteredProducts: () => {
        const { products, filter, searchQuery } = get();

        let filtered = products;

        if (filter === "favorites") {
          filtered = filtered.filter((product) => product.isLiked);
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (product) =>
              product.title.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query) ||
              product.brand.toLowerCase().includes(query),
          );
        }

        return filtered;
      },

      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },
    }),
    {
      name: "product-storage",
      partialize: (state) => ({
        likedProducts: state.likedProducts,
        products: state.products,
      }),
    },
  ),
);
