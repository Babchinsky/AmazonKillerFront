import React, { useState, useEffect } from 'react';
import { Product, ProductDetail, ProductFeature } from '../../types/Product';
import { ADMIN_TOKEN } from '../../utils/authToken';
import './ProductDetailsModal.scss';
import {API_BASE_URL} from "../../config/api.ts";

interface ProductDetailsModalProps {
  product: Product;
  categoryName?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductResponse {
  id: string;
  name: string;
  code: string;
  price: number;
  imageUrl: string;
  rating: number;
  discountPercent: number | null;
  categoryId: string;
  categoryName: string;
  quantity: number;
  rowVersion: string;
  concurrencyStamp: string;
  attributes: Array<{
    key: string;
    value: string;
  }>;
  features: Array<{
    name: string;
    description: string;
  }>;
  imageUrls?: string[];
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product: initialProduct,
  categoryName,
  isOpen,
  onClose
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchProductDetails();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${initialProduct.id}`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();
      console.log('Fetched product details:', data);

      // Преобразуем данные в формат Product
      setProduct({
        ...initialProduct,
        code: data.code,
        images: data.imageUrls || [data.imageUrl],
        rowVersion: data.concurrencyStamp || data.rowVersion,
        details: data.attributes.map(attr => ({
          key: attr.key,
          value: attr.value
        })),
        features: data.features.map(feature => ({
          title: feature.name,
          description: feature.description
        }))
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (!isOpen) return null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="product-details-modal">
      <div className="product-details-modal__overlay" onClick={onClose} />
      <div className="product-details-modal__content">
        <div className="product-details-modal__grid">
          <div className="product-details-modal__images">
            <div className="product-details-modal__main-image">
              <img src={product.images[currentImageIndex]} alt={product.name} />
              {product.images.length > 1 && (
                <>
                  <button 
                    className="product-details-modal__nav-button product-details-modal__nav-button--prev" 
                    onClick={handlePrevImage}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                  <button 
                    className="product-details-modal__nav-button product-details-modal__nav-button--next" 
                    onClick={handleNextImage}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="product-details-modal__thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-details-modal__thumbnail ${
                      index === currentImageIndex ? 'product-details-modal__thumbnail--active' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-details-modal__info">
            <div className="product-details-modal__header">
              <h2 className="product-details-modal__title">{product.name}</h2>
              <div className="product-details-modal__code">Code: {product.code}</div>
            </div>

            <div className="product-details-modal__section">
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Category</div>
                <div className="product-details-modal__value">{categoryName}</div>
              </div>
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Original price</div>
                <div className="product-details-modal__value">${product.price.toFixed(2)}</div>
              </div>
              {typeof product.discount === 'number' && product.discount > 0 && (
                <>
                  <div className="product-details-modal__row">
                    <div className="product-details-modal__label">Discount</div>
                    <div className="product-details-modal__value">
                      <span className="product-details-modal__discount">-{product.discount}%</span>
                    </div>
                  </div>
                  <div className="product-details-modal__row">
                    <div className="product-details-modal__label">New price</div>
                    <div className="product-details-modal__value product-details-modal__value--discounted">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </div>
                  </div>
                </>
              )}
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Quantity</div>
                <div className="product-details-modal__value">{product.quantity}</div>
              </div>
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Rating</div>
                <div className="product-details-modal__value">
                  <div className="product-details-modal__rating">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    {product.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {product.details.length > 0 && (
              <div className="product-details-modal__section">
                <h3 className="product-details-modal__subtitle">Product details</h3>
                {product.details.map((detail, index) => (
                  <div key={index} className="product-details-modal__feature">
                    <button 
                      className="product-details-modal__feature-header"
                      onClick={() => {
                        const newExpandedFeatures = new Set(expandedFeatures);
                        if (newExpandedFeatures.has(-index - 1)) {
                          newExpandedFeatures.delete(-index - 1);
                        } else {
                          newExpandedFeatures.add(-index - 1);
                        }
                        setExpandedFeatures(newExpandedFeatures);
                      }}
                    >
                      <span className="product-details-modal__feature-title">{detail.key}</span>
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className={expandedFeatures.has(-index - 1) ? 'expanded' : ''}
                      >
                        <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                    {expandedFeatures.has(-index - 1) && (
                      <div className="product-details-modal__feature-content">
                        {detail.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {product.features.length > 0 && (
              <div className="product-details-modal__section">
                <h3 className="product-details-modal__subtitle">About product</h3>
                {product.features.map((feature, index) => (
                  <div key={index} className="product-details-modal__feature">
                    <button 
                      className="product-details-modal__feature-header"
                      onClick={() => {
                        const newExpandedFeatures = new Set(expandedFeatures);
                        if (newExpandedFeatures.has(index)) {
                          newExpandedFeatures.delete(index);
                        } else {
                          newExpandedFeatures.add(index);
                        }
                        setExpandedFeatures(newExpandedFeatures);
                      }}
                    >
                      <span className="product-details-modal__feature-title">{feature.title}</span>
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className={expandedFeatures.has(index) ? 'expanded' : ''}
                      >
                        <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                    {expandedFeatures.has(index) && (
                      <div className="product-details-modal__feature-content">
                        {feature.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="product-details-modal__section">
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Created</div>
                <div className="product-details-modal__value">{formatDate(product.createdAt)}</div>
              </div>
              <div className="product-details-modal__row">
                <div className="product-details-modal__label">Last update</div>
                <div className="product-details-modal__value">{formatDate(product.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 