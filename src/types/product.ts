export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  isLiked?: boolean;
  createAt?: Date;
  updateAt?: Date;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

export type FilterType = "all" | "favorites";
