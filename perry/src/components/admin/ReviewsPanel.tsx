import React, { useState, ChangeEvent, useEffect } from 'react';
import TextInput from '../inputs/TextInput';
import { ConfirmModal } from '../common/ConfirmModal';
import { ImageViewer } from '../common/ImageViewer';
import './ReviewsPanel.scss';
import { ADMIN_TOKEN } from '../../utils/authToken';

interface ReviewContent {
  id: string;
  article: string;
  message: string;
  filePaths: string[];
}

interface Rating {
  value: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
}

interface Review {
  id: string;
  content: ReviewContent;
  rating: Rating;
  productId: string;
  product: Product;
  userId: string;
  user: User;
  createdAt: string;
  likes: number;
}

export const ReviewsPanel: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchValue(searchQuery);
    }
  }, []);

  const fetchProductName = async (productId: string): Promise<string> => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productData = await response.json();
      return productData.name;
    } catch (error) {
      console.error('Ошибка при загрузке имени продукта:', error);
      return 'Unknown Product';
    }
  };

  const fetchUserDetails = async (userId: string): Promise<{ name: string; email: string }> => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      console.log('Сырой ответ от сервера:', userData);
      const name = `${userData.firstName} ${userData.lastName}`;
      console.log('Полученные данные пользователя:', userData);
      return { name, email: userData.email };
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      return { name: 'Unknown User', email: 'unknown@example.com' };
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reviewsFromApi = await Promise.all(data.items.map(async (item: any) => {
        const productName = await fetchProductName(item.productId);
        const userDetails = await fetchUserDetails(item.userId);
        return {
          id: item.id,
          content: {
            id: item.id,
            article: item.article,
            message: item.message,
            filePaths: item.imageUrls
          },
          rating: { value: item.rating },
          productId: item.productId,
          product: { id: item.productId, name: productName },
          userId: item.userId,
          user: { id: item.userId, name: userDetails.name, email: userDetails.email },
          createdAt: item.createdAt,
          likes: item.likes
        };
      }));
      setReviews(reviewsFromApi);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    console.log('Обновленные отзывы:', reviews);
  }, [reviews]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedReviews([]);
  };

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Отзыв успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    setReviewToDelete(null);
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchValue.toLowerCase();
    return (
      review.user.name.toLowerCase().includes(searchLower) ||
      review.user.email.toLowerCase().includes(searchLower) ||
      review.id.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const renderStars = (rating: number) => {
    return (
      <div className="reviews-panel__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 1L13 7L19 8L14.5 13L15.5 19L10 16L4.5 19L5.5 13L1 8L7 7L10 1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-panel">
      <ConfirmModal
        isOpen={!!reviewToDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
        onConfirm={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
        onCancel={() => setReviewToDelete(null)}
      />
      <ImageViewer
        isOpen={!!selectedImage}
        imageUrl={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
      <div className="reviews-panel__header">
        <div className="reviews-panel__controls-group">
          <div className="reviews-panel__search">
            <TextInput
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search by user name, email or review ID..."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <div className="reviews-panel__content">
        <div className="reviews-panel__reviews-list">
          {reviews.length === 0 ? (
            <div className="reviews-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M24 16V24M24 32H24.02" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No reviews found. Reviews will appear here when customers leave them</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="reviews-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No reviews match your search</p>
            </div>
          ) : (
            <>
              {paginatedReviews.map(review => (
                <div key={review.id} className="reviews-panel__review-item">
                  <div 
                    className="reviews-panel__review-header"
                    onClick={() => toggleReviewExpand(review.id)}
                  >
                    <div className="reviews-panel__review-info">
                      <div className="reviews-panel__user-info">
                        <h3>{review.user.name}</h3>
                        <span className="reviews-panel__user-email">{review.user.email}</span>
                      </div>
                      <div className="reviews-panel__review-meta">
                        <span className="reviews-panel__product-name">{review.product.name}</span>
                        <span className="reviews-panel__date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {renderStars(review.rating.value)}
                    </div>
                    <svg
                      className={`expand-arrow ${expandedReviews.includes(review.id) ? 'expanded' : ''}`}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  
                  <div className={`reviews-panel__review-content ${expandedReviews.includes(review.id) ? 'expanded' : ''}`}>
                    <div className="reviews-panel__review-article">
                      <h4>Article</h4>
                      <p>{review.content.article}</p>
                    </div>
                    <div className="reviews-panel__review-message">
                      <h4>Message</h4>
                      <p>{review.content.message}</p>
                    </div>
                    {review.content.filePaths.length > 0 && (
                      <div className="reviews-panel__review-images">
                        <h4>Attached Images</h4>
                        <div className="reviews-panel__images-grid">
                          {review.content.filePaths.map((path, index) => (
                            <div 
                              key={index} 
                              className="reviews-panel__image-container"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(path);
                              }}
                            >
                              <img src={path} alt={`Review image ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="reviews-panel__review-footer">
                      <div className="reviews-panel__likes">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7 10V17H3V10H7ZM17 8.5C17 7.67157 16.3284 7 15.5 7H11L11.7519 3.99594C11.9126 3.35229 11.4116 2.73656 10.7525 2.70797V2.70797C10.2361 2.68475 9.76231 2.96807 9.54712 3.43L7 8.5V17H15.5C16.3284 17 17 16.3284 17 15.5V8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <span>{review.likes}</span>
                      </div>
                      <div className="reviews-panel__review-actions">
                        <div className="reviews-panel__review-id">
                          ID: {review.id}
                        </div>
                        <button
                          className="reviews-panel__delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewToDelete(review.id);
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H17M15 6V16C15 17.1046 14.1046 18 13 18H7C5.89543 18 5 17.1046 5 16V6M8 6V4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="reviews-panel__pagination">
                  <button
                    className={`page-button arrow ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          className={`page-button ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <button key={page} className="page-button dots">
                          ...
                        </button>
                      );
                    }
                    return null;
                  })}

                  <button
                    className={`page-button arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 