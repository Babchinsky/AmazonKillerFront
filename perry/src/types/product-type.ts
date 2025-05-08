type ProductType = {
  id: string;
  name: string;
  rating: number;
  code: string;
  reviewsCount: number;
  productPics: string[];
  detailsId: string;
  categoryId: string;
  price: number;
  discount: number;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
};

export default ProductType;