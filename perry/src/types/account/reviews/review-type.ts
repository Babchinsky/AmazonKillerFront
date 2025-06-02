type ReviewType = {
  id: string;
  rating: number;
  productId: string;
  userId: string;
  createdAt: string;
  userFullName: string;
  userImageUrl: string;
  article: string;
  message: string;
  imageUrls: string[];
  tags: string[];
  likes: number;
  rowVersion: string;
};

export default ReviewType;