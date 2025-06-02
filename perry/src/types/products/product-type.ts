import ProductAttributeType from "./product-attribute-type";
import ProductFeatureType from "./product-feature-type";


type ProductType = {
  id: string;
  name: string;
  rating: number;
  code: string;
  reviewsCount: number;
  imageUrls: string[];
  categoryId: string;
  price: number;
  discountPercent?: number | null;
  quantity: number;
  soldCount: number;
  attributes: ProductAttributeType[];
  features: ProductFeatureType[];
  rowVersion: string;
};

export default ProductType;