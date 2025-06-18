import React, { useState, useRef, useEffect } from 'react';
import AdminInput from './AdminInput';
import { ConfirmModal } from '../common/ConfirmModal';
import { ProductForm } from './ProductForm';
import { ProductDetailsModal } from './ProductDetailsModal';
import { Product } from '../../types/admin/Product';
import './ProductsPanel.scss';
import { ADMIN_TOKEN } from '../../utils/auth/authToken';
import { API_BASE_URL } from '../../config/api';

interface Category {
  id: string;
  name: string;
}

interface ProductResponse {
  items: Array<{
    id: string;
    name: string;
    code: string;
    price: number;
    imageUrl: string;
    rating: number;
    reviewsCount: number;
    discountPercent: number | null;
    categoryId: string;
    categoryName: string;
    quantity: number;
    rowVersion: string;
    concurrencyStamp: string;
    attributes?: Array<{
      key: string;
      value: string;
    }>;
    features?: Array<{
      name: string;
      description: string;
    }>;
  }>;
  page: number;
  pageSize: number;
  totalCount: number;
}

export const ProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const itemsPerPage = 10;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const categoriesFromApi = (data.items || data).map((category: any) => ({
        id: category.id,
        name: category.name
      }));
      setCategories(categoriesFromApi);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();
      console.log('Raw server response:', data);
      
      const transformedProducts = data.items.map(item => {
        console.log('Raw item from server:', item);
        const transformedProduct = {
          id: item.id,
          name: item.name,
          code: item.code,
          images: item.imageUrl ? [item.imageUrl] : [],
          price: item.price,
          discount: item.discountPercent || undefined,
          quantity: item.quantity,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          rating: item.rating,
          details: item.attributes ? item.attributes.map(attr => ({
            key: attr.key,
            value: attr.value
          })) : [],
          features: item.features ? item.features.map(feature => ({
            title: feature.name,
            description: feature.description
          })) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rowVersion: item.concurrencyStamp || item.rowVersion
        };
        console.log('Transformed product:', transformedProduct);
        return transformedProduct;
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      console.log('Searching for:', query);
      
      filtered = filtered.filter(product => {
        const nameMatch = (product.name?.toLowerCase() || '').includes(query);
        
        console.log('Product:', {
          name: product.name,
          nameMatch
        });
        
        return nameMatch;
      });
      
      console.log('Found products:', filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, selectedCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search value:', value);
    setSearchQuery(value);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/delete-many`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: [productId]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(prev => prev.filter(product => product.id !== productId));
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleProductClick = (e: React.MouseEvent, product: Product) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.products-panel__actions')) {
      setSelectedProduct(product);
      setShowDetails(true);
    }
  };

  const handleSubmitProduct = (productData: Omit<Product, 'id' | 'rating' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      setProducts(prev =>
        prev.map(p =>
          p.id === selectedProduct.id
            ? {
                ...p,
                ...productData,
                updatedAt: new Date().toISOString()
              }
            : p
        )
      );
    } else {
      setProducts(prev => [...prev, {
        ...productData,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedProduct(null);
    
    fetchProducts();
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const uniqueCategories = categories;

  return (
    <div className="products-panel">
      <div className="products-panel__header">
        <div className="products-panel__controls-group">
          <div className="products-panel__left-controls">
            <button 
              className="products-panel__add-button"
              onClick={() => setShowForm(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Add product
            </button>

            <div className="products-panel__categories-dropdown" ref={dropdownRef}>
              <button
                className={`products-panel__categories-dropdown-button ${showCategoryDropdown ? 'active' : ''}`}
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <span>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'All categories' : 'All categories'}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>

              <div className={`products-panel__categories-dropdown-content ${showCategoryDropdown ? 'active' : ''}`}>
                <div className="products-panel__categories-dropdown-list">
                  <div
                    className={`products-panel__categories-dropdown-item ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory('');
                      setShowCategoryDropdown(false);
                    }}
                  >
                    All categories
                  </div>
                  {uniqueCategories.map(category => (
                    <div
                      key={category.id}
                      className={`products-panel__categories-dropdown-item ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AdminInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <div className="products-panel__content">
        {products.length === 0 ? (
          <div className="products-panel__empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No products found. Click "Add product" to create your first product</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-panel__empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No products match your search</p>
          </div>
        ) : (
          <>
            <div className="products-panel__list-container">
              <div className="products-panel__table">
                <div className="products-panel__table-header">
                  <div className="products-panel__table-row">
                    <div className="products-panel__table-cell image">Image</div>
                    <div className="products-panel__table-cell name">Name</div>
                    <div className="products-panel__table-cell category">Category</div>
                    <div className="products-panel__table-cell price">Price</div>
                    <div className="products-panel__table-cell rating">Rating</div>
                    <div className="products-panel__table-cell actions">Actions</div>
                  </div>
                </div>

                <div className="products-panel__table-body">
                  {currentProducts.map(product => (
                    <div
                      key={product.id}
                      className="products-panel__table-row"
                      onClick={(e) => handleProductClick(e, product)}
                    >
                      <div className="products-panel__table-cell image">
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="products-panel__table-cell name">
                        <div className="products-panel__product-name">{product.name}</div>
                      </div>
                      <div className="products-panel__table-cell category">
                        {product.categoryName}
                      </div>
                      <div className="products-panel__table-cell price">
                        <div className="products-panel__price-container">
                          <div className="products-panel__original-price">${product.price.toFixed(2)}</div>
                          {product.discount && (
                            <span className="products-panel__discount">-{product.discount}%</span>
                          )}
                        </div>
                      </div>
                      <div className="products-panel__table-cell rating">
                        <div className="products-panel__rating">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                          </svg>
                          {product.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="products-panel__table-cell actions">
                        <button
                          className="products-panel__action-button edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowForm(true);
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4V20H20V13M18.5 2.5L21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </button>
                        <button
                          className="products-panel__action-button delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowConfirmDelete(true);
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M3 7H21M16 7L15.2815 4.72167C15.107 4.2987 14.6862 4 14.2169 4H9.78312C9.31381 4 8.89297 4.2987 8.71849 4.72167L8 7" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {filteredProducts.length > itemsPerPage && (
              <div className="products-panel__pagination">
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

      {showForm && (
        <ProductForm
          product={selectedProduct || undefined}
          onSubmit={handleSubmitProduct}
          onCancel={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
          categories={uniqueCategories}
          isOpen={showForm}
        />
      )}

      {showDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          categoryName={selectedProduct.categoryName}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmDelete}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => selectedProduct && handleDeleteProduct(selectedProduct.id)}
        onCancel={() => {
          setShowConfirmDelete(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}; 