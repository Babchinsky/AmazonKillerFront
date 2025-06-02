type ProductCardType = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  discountPercent?: number | null;
};

export default ProductCardType;