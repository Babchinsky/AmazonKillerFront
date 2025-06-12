import React, { useState, useEffect, useRef } from 'react';
import TextInput from '../inputs/TextInput';
import { Product, ProductDetail, ProductFeature } from '../../types/Product';
import { ADMIN_TOKEN } from '../../utils/authToken';
import './ProductForm.scss';
import {API_BASE_URL} from "../../config/api.ts";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'rating' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  categories: { id: string; name: string }[];
  isOpen: boolean;
}

interface ProductResponse {
  id: string;
  name: string;
  code: string;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  rating: number;
  discountPercent: number | null;
  categoryId: string;
  categoryName: string;
  quantity: number;
  rowVersion: string;
  attributes: Array<{
    key: string;
    value: string;
  }>;
  features: Array<{
    name: string;
    description: string;
  }>;
}

const CategoryDropdown: React.FC<{
  categories: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ categories, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="product-form__category-input" ref={dropdownRef}>
      <TextInput
        label="Category"
        value={categories.find(c => c.id === selectedId)?.name || ''}
        onChange={() => {}}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Choose category..."
        required
        readOnly
        className={isOpen ? 'active' : ''}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        }
      />
      <div className={`product-form__category-dropdown ${isOpen ? 'active' : ''}`}>
        {categories.map(category => (
          <div
            key={category.id}
            className={`product-form__category-option ${selectedId === category.id ? 'active' : ''}`}
            onClick={() => {
              onSelect(category.id);
              setIsOpen(false);
            }}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductForm: React.FC<ProductFormProps> = ({
  product: initialProduct,
  onSubmit,
  onCancel,
  categories,
  isOpen
}) => {
  const [name, setName] = useState(initialProduct?.name || '');
  const [code, setCode] = useState(initialProduct?.code || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || '');
  const [price, setPrice] = useState(initialProduct?.price?.toString() || '');
  const [discount, setDiscount] = useState(initialProduct?.discount?.toString() || '');
  const [quantity, setQuantity] = useState(initialProduct?.quantity?.toString() || '');
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [details, setDetails] = useState<ProductDetail[]>(initialProduct?.details || []);
  const [features, setFeatures] = useState<ProductFeature[]>(initialProduct?.features || []);
  const [rowVersion, setRowVersion] = useState<string | undefined>(initialProduct?.rowVersion);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCode(initialProduct.code);
      setCategoryId(initialProduct.categoryId);
      setPrice(initialProduct.price.toString());
      setDiscount(initialProduct.discount?.toString() || '');
      setQuantity(initialProduct.quantity.toString());
      setImages(initialProduct.images);
      setDetails(initialProduct.details);
      setFeatures(initialProduct.features);
      setRowVersion(initialProduct.rowVersion);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialProduct) {
        fetchProductDetails();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchProductDetails = async () => {
    if (!initialProduct) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${initialProduct.id}`, {
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

      setName(data.name);
      setCode(data.code);
      setCategoryId(data.categoryId);
      setPrice(data.price.toString());
      setDiscount(data.discountPercent?.toString() || '');
      setQuantity(data.quantity.toString());
      
      // Обработка изображений
      const imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [data.imageUrl];
      console.log('Received image URLs:', imageUrls);
      setImages(imageUrls);
      
      // Конвертируем URL в File объекты
      const files = await Promise.all(
        imageUrls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const fileName = url.split('/').pop() || 'image.jpg';
          return new File([blob], fileName, { type: blob.type });
        })
      );
      setImageFiles(files);

      // Обработка атрибутов и характеристик
      if (data.attributes) {
        setDetails(data.attributes.map(attr => ({
          key: attr.key,
          value: attr.value
        })));
      }

      if (data.features) {
        setFeatures(data.features.map(feature => ({
          title: feature.name,
          description: feature.description
        })));
      }
      
      // Сохраняем rowVersion сразу после получения данных
      console.log('Received rowVersion:', data.rowVersion);
      setRowVersion(data.rowVersion);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const generateProductCode = () => {
    const timestamp = Date.now();
    return `PROD-${timestamp}`;
  };

  useEffect(() => {
    if (!code && !initialProduct) {
      setCode(generateProductCode());
    }
  }, [code, initialProduct]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = [...images];
      const newImageFiles = [...imageFiles];
      
      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= 10) break;
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
        newImageFiles.push(file);
      }
      
      setImages(newImages);
      setImageFiles(newImageFiles);
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Также удаляем соответствующий файл, если он есть
    if (index < imageFiles.length) {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index, 1);
      setImageFiles(newImageFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Если это редактирование, сначала обновим rowVersion
    if (initialProduct) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/products/${initialProduct.id}`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch latest product version`);
        }

        const data: ProductResponse = await response.json();
        console.log('Updated rowVersion before submit:', data.rowVersion);
        
        // Directly use the fetched rowVersion instead of setting state and using it later
        const currentRowVersion = data.rowVersion;

        // Continue with form submission using the fetched rowVersion
        submitProductForm(currentRowVersion);
      } catch (error) {
        console.error('Error fetching latest rowVersion:', error);
        alert('Failed to get latest product version. Please try again.');
        return;
      }
    } else {
      // For new products, no rowVersion needed
      submitProductForm();
    }
  };

  const submitProductForm = async (currentRowVersion?: string) => {
    // Проверяем заполненность обязательных полей
    if (!code.trim()) {
      alert('Код продукта не может быть пустым');
      return;
    }

    if (!name.trim()) {
      alert('Название продукта не может быть пустым');
      return;
    }

    if (!categoryId && !initialProduct) {
      alert('Выберите категорию');
      return;
    }

    // Преобразуем значения в правильные типы
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount ? parseFloat(discount) : null;
    const parsedQuantity = parseInt(quantity, 10);

    // Проверяем валидность числовых значений
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Введите корректную цену больше 0');
      return;
    }

    if (parsedDiscount !== null && (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100)) {
      alert('Скидка должна быть от 0 до 100%');
      return;
    }

    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert('Количество не может быть отрицательным');
      return;
    }

    // Проверка наличия изображений для всех продуктов
    if (images.length === 0 && imageFiles.length === 0) {
      alert('Пожалуйста, добавьте хотя бы одно изображение');
      return;
    }

    try {
      const formData = new FormData();

      // Добавляем основные поля для редактирования
      if (initialProduct) {
        formData.append('id', initialProduct.id);
        if (!currentRowVersion) {
          console.error('rowVersion is missing!');
          alert('Unable to save changes: missing version information. Please refresh and try again.');
          return;
        }
        console.log('Sending rowVersion:', currentRowVersion);
        formData.append('RowVersion', currentRowVersion);
        
        // Добавляем новые файлы, если они есть
        if (imageFiles.length > 0) {
          imageFiles.forEach((file) => {
            formData.append('Images', file);
          });
        }
        
        // Указываем бэкенду, что есть существующие изображения 
        // (на случай если не загружаем новые)
        if (images.length > 0 && imageFiles.length === 0) {
          // Добавляем специальный флаг, который подскажет бэкенду что 
          // не нужно требовать новых изображений, т.к. есть существующие
          formData.append('KeepExistingImages', 'true');
          
          // Для совместимости с разными версиями API также добавляем
          // существующие URLs как JSON строку
          formData.append('ExistingImageUrls', JSON.stringify(images));
        }
      } else {
        // Для нового продукта проверяем наличие изображений
        if (imageFiles.length === 0) {
          alert('Пожалуйста, добавьте хотя бы одно изображение');
          return;
        }
        
        // Добавляем файлы изображений при создании
        imageFiles.forEach((file) => {
          formData.append('Images', file);
        });
      }

      formData.append('Code', code.trim());
      formData.append('Name', name.trim());
      formData.append('CategoryId', categoryId);
      formData.append('Price', parsedPrice.toString());
      if (parsedDiscount !== null) {
        formData.append('DiscountPercent', parsedDiscount.toString());
      }
      formData.append('Quantity', parsedQuantity.toString());

      // Добавляем атрибуты как JSON строку
      const attributesJson = JSON.stringify(
        details
          .filter(detail => detail.key.trim() && detail.value.trim())
          .map(detail => ({
            key: detail.key.trim(),
            value: detail.value.trim()
          }))
      );
      formData.append('Attributes', attributesJson);

      // Добавляем характеристики как JSON строку
      const featuresJson = JSON.stringify(
        features
          .filter(feature => feature.title.trim() && feature.description.trim())
          .map(feature => ({
            name: feature.title.trim(),
            description: feature.description.trim()
          }))
      );
      formData.append('Features', featuresJson);

      console.log('Отправляемые данные (FormData):');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const url = initialProduct
        ? `${API_BASE_URL}/api/admin/products/${initialProduct.id}`
        : `${API_BASE_URL}/api/admin/products`;

      const response = await fetch(url, {
        method: initialProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
        },
        body: formData
      });

      const responseText = await response.text();
      console.log('Ответ сервера (raw):', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText) as { errors?: Record<string, string[]> };
          console.error('Ответ сервера (parsed):', errorData);
          if (errorData.errors) {
            errorMessage += '\nValidation errors:\n' + 
              Object.entries(errorData.errors)
                .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                .join('\n');
          }
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      console.log('Успешный ответ:', data);

      // Преобразуем данные в формат Product для локального состояния
      const newProduct: Omit<Product, 'id' | 'rating' | 'createdAt' | 'updatedAt'> = {
        name,
        code,
        categoryId,
        categoryName: categories.find(c => c.id === categoryId)?.name || 'Unknown category',
        price: parsedPrice,
        discount: parsedDiscount || undefined,
        quantity: parsedQuantity,
        images,
        details,
        features
      };

      onSubmit(newProduct);
    } catch (error) {
      console.error('Ошибка при создании продукта:', error);
      alert(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleAddDetail = () => {
    setDetails([...details, { key: '', value: '' }]);
  };

  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const handleAddFeature = () => {
    setFeatures([...features, { title: '', description: '' }]);
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-modal">
      <div className="product-form-modal__overlay" onClick={onCancel} />
      <div className="product-form-modal__content">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-form__header">
            <div className="product-form__title">
              {initialProduct ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
              {initialProduct ? 'Edit product' : 'Add product'}
            </div>
          </div>

          <div className="product-form__content">
            <div className="product-form__section">
              <TextInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name..."
                required
              />

              <TextInput
                label="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter product code..."
                required
                maxLength={60}
                showCharCount
              />

              <CategoryDropdown
                categories={categories}
                selectedId={categoryId}
                onSelect={setCategoryId}
              />

              <div className="product-form__images">
                <div className="product-form__images-header">
                  <span>Pictures</span>
                  <span className="product-form__images-count">{images.length} / 10</span>
                </div>
                <div className="product-form__images-grid">
                  {images.map((image, index) => (
                    <div key={index} className="product-form__image">
                      <img src={image} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        className="product-form__image-delete"
                        onClick={() => handleImageDelete(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="product-form__image-upload"
                        onClick={handleImageUpload}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Add picture</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <TextInput
                label="Price, $"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter product price..."
                type="number"
                required
              />

              <TextInput
                label="Discount, %"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Enter product discount..."
                type="number"
              />

              <TextInput
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter the quantity of your product..."
                type="number"
                required
              />
            </div>

            <div className="product-form__section product-form__section--details">
              <div className="product-form__section-header">
                <h2>Product details</h2>
                <button
                  type="button"
                  className="product-form__add-button"
                  onClick={handleAddDetail}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Add product detail
                </button>
              </div>
              {details.map((detail, index) => (
                <div key={index} className="product-form__detail">
                  <TextInput
                    label="Property"
                    value={detail.key}
                    onChange={(e) => handleDetailChange(index, 'key', e.target.value)}
                    placeholder="Enter property name..."
                  />
                  <TextInput
                    label="Info"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                    placeholder="Enter property info..."
                    maxLength={30}
                    showCharCount
                  />
                </div>
              ))}
            </div>

            <div className="product-form__section product-form__section--details">
              <div className="product-form__section-header">
                <h2>About product</h2>
                <button
                  type="button"
                  className="product-form__add-button"
                  onClick={handleAddFeature}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Add product feature
                </button>
              </div>
              {features.map((feature, index) => (
                <div key={index} className="product-form__feature">
                  <TextInput
                    label="Feature"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    placeholder="Enter feature name..."
                  />
                  <TextInput
                    label="Info"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    placeholder="Enter feature info..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-form__footer">
            <button
              type="button"
              className="product-form__button product-form__button--cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="product-form__button product-form__button--primary"
            >
              {initialProduct ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 