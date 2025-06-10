export interface ProductDetail {
  key: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  images: string[];
  price: number;
  discount?: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  rating: number;
  details: ProductDetail[];
  features: ProductFeature[];
  createdAt: string;
  updatedAt: string;
  rowVersion?: string;
} 