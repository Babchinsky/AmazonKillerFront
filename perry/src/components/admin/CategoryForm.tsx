import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import TextInput from '../inputs/TextInput';
import './CategoryForm.scss';
import { ADMIN_TOKEN } from '../../utils/authToken';
import { Category, CategoryFormData } from '../../types/category';
import { API_BASE_URL } from '../../config/api';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Category) => void;
  onCancel: () => void;
  parentCategories: Category[];
  initialParentId?: string | null;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  image?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  parentCategories,
  initialParentId
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(category?.id || null);
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [parentId, setParentId] = useState<string | null>(initialParentId || category?.parentId || null);
  const [status, setStatus] = useState<'active' | 'inactive'>(category?.status || 'active');
  const [role, setRole] = useState<'parent' | 'child'>(initialParentId ? 'child' : (category?.role || 'parent'));
  const [image, setImage] = useState<string | undefined>(category?.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Функция для получения всех ID подкатегорий
  const getChildrenIds = (categoryId: string, categories: Category[]): string[] => {
    const children = categories.filter(cat => cat.parentId === categoryId);
    const childrenIds = children.map(child => child.id);
    const grandChildrenIds = children.flatMap(child => getChildrenIds(child.id, categories));
    return [...childrenIds, ...grandChildrenIds];
  };

  // Получаем список доступных родительских категорий
  const availableParentCategories = useMemo(() => {
    // Если это создание новой категории, показываем только активные родительские категории
    if (!category) {
      return parentCategories.filter(cat => !cat.parentId && cat.status !== 'inactive');
    }

    // Получаем все ID подкатегорий текущей категории
    const childrenIds = getChildrenIds(category.id, parentCategories);
    
    // Создаем множество всех недоступных ID категорий
    const unavailableIds = new Set([
      category.id, // текущая категория
      ...childrenIds, // все подкатегории текущей категории
      ...parentCategories // все подкатегории любых других категорий
        .filter(cat => cat.parentId) // берем только дочерние категории
        .map(cat => cat.id) // получаем их ID
    ]);

    // Фильтруем категории
    return parentCategories.filter(cat => 
      !unavailableIds.has(cat.id) && // категория не в списке недоступных
      !cat.parentId && // это родительская категория
      cat.status !== 'inactive' // категория активна
    );
  }, [category, parentCategories]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setParentId(null);
    setStatus('active');
    setRole('parent');
    setImage(undefined);
    setImageFile(null);
    setShowParentDropdown(false);
    setShowStatusDropdown(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleParentSelect = (selectedParentId: string | null) => {
    setParentId(selectedParentId);
    setRole(selectedParentId ? 'child' : 'parent');
    setShowParentDropdown(false);
  };

  const handleStatusSelect = (newStatus: 'active' | 'inactive') => {
    setStatus(newStatus);
    setShowStatusDropdown(false);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('New image selected:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      
      // Сохраняем File объект для последующей отправки
      setImageFile(file);
      
      // Создаем URL для предпросмотра
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: undefined }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected in handleImageChange');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация
    const validationErrors: ValidationErrors = {};
    
    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }
    if (!description.trim()) {
      validationErrors.description = 'Description is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Обязательные поля
      formData.append('Name', name.trim());
      formData.append('Description', description.trim());
      formData.append('Status', status === 'active' ? '0' : '1');
      formData.append('IconName', 'null');
      
      // ParentId - only append if it has a value
      if (parentId) {
        formData.append('ParentId', parentId);
      }
      // For main categories (parentId is null), we don't send ParentId at all

      // Add image for all categories if available
      if (imageFile) {
        console.log('Adding image file to FormData:', {
          fileName: imageFile.name,
          fileType: imageFile.type,
          fileSize: imageFile.size,
          lastModified: imageFile.lastModified
        });
        formData.append('Image', imageFile);
      }

      // Логируем содержимое FormData перед отправкой
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      if (category && selectedCategoryId) {
        try {
          const freshResponse = await fetch(`${API_BASE_URL}/api/admin/categories/${selectedCategoryId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ADMIN_TOKEN}`,
            }
          });
      
          if (!freshResponse.ok) {
            throw new Error(`Failed to fetch category: ${freshResponse.status}`);
          }
      
          const freshData = await freshResponse.json();
          const freshId = freshData.id;
          const freshRowVersion = freshData.rowVersion;
      
          setSelectedCategoryId(freshId); // На всякий случай обновим
      
          // Собираем данные
          const formDataUpdate = new FormData();
          formDataUpdate.append('Id', freshId);
          formDataUpdate.append('RowVersion', freshRowVersion);
          formDataUpdate.append('Name', name.trim());
          formDataUpdate.append('Description', description.trim());
          formDataUpdate.append('Status', status === 'active' ? '0' : '1');
          formDataUpdate.append('IconName', 'null');
      
          // ParentId - only append if it has a value
          if (parentId) {
            formDataUpdate.append('ParentId', parentId);
          }
          // For main categories (parentId is null), we don't send ParentId at all
      
          if (imageFile) {
            console.log('Adding image file to FormDataUpdate:', {
              fileName: imageFile.name,
              fileType: imageFile.type,
              fileSize: imageFile.size,
              lastModified: imageFile.lastModified
            });
            formDataUpdate.append('Image', imageFile);
          }
          
          // Log FormData contents before sending update
          console.log('FormDataUpdate contents:');
          for (const [key, value] of formDataUpdate.entries()) {
            console.log(`${key}:`, value);
          }
      
          console.log(`Sending PUT request to: ${API_BASE_URL}/api/admin/categories/${freshId}`);
          const response = await fetch(`${API_BASE_URL}/api/admin/categories/${freshId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${ADMIN_TOKEN}`,
              // Do not set Content-Type header, let the browser set it correctly for FormData with files
            },
            body: formDataUpdate
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response for update:', errorText);
            try {
              const errorData = JSON.parse(errorText);
              console.error('Error details for update:', {
                status: response.status,
                statusText: response.statusText,
                errors: errorData.errors,
                fullError: errorData
              });
            } catch (e) {
              console.error('Failed to parse error response for update');
            }
            throw new Error(`PUT failed: ${response.status}`);
          }
      
          const updatedData = await response.json();
          const updatedCategory: Category = {
            ...category,
            id: updatedData.id,
            rowVersion: updatedData.rowVersion,
            name: name.trim(),
            description: description.trim(),
            status,
            imageUrl: updatedData.imageUrl,
            parentId,
            role: parentId ? 'child' : 'parent',
            updatedAt: new Date().toISOString()
          };
      
          console.log('Successfully updated category:', updatedCategory);
          // Clear the form before notifying the parent component
          setImageFile(null);
          setImage(updatedCategory.imageUrl);
          onSubmit(updatedCategory);
          onCancel(); // Close the form
        } catch (err) {
          console.error('Error during update with refetch:', err);
          setErrors({ name: 'Failed to update category (check console)' });
        }
      }      
        else {
        // Создание новой категории
        console.log('Sending request to create category with FormData');
        const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error('Error details:', {
              status: response.status,
              statusText: response.statusText,
              errors: errorData.errors,
              fullError: errorData
            });
          } catch (e) {
            console.error('Failed to parse error response');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const createdCategoryData = await response.json();
        console.log('Server response:', createdCategoryData);
        
        const createdCategory: Category = {
          ...createdCategoryData,
          role: parentId ? 'child' : 'parent',
          status: createdCategoryData.status === 0 ? 'active' : 'inactive',
          imageUrl: createdCategoryData.imageUrl, // Явно указываем imageUrl из ответа сервера
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log('Created category with image:', createdCategory);
        // Clear the form before notifying the parent component
        setImageFile(null);
        setImage(createdCategory.imageUrl);
        onSubmit(createdCategory);
        onCancel(); // Close the form
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      setErrors({ name: 'Failed to save category' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="category-form">
      <div className="category-form__header">
        <h2>{category ? 'Edit Category' : 'New Category'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="category-form__form">
        <div className="category-form__field">
          <label htmlFor="name">Name</label>
          <TextInput
            id="name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="Enter category name"
            isError={!!errors.name}
            errorMessage={errors.name}
          />
        </div>

        <div className="category-form__field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className={`category-form__textarea ${errors.description ? 'error' : ''}`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Enter category description"
            rows={4}
          />
          {errors.description && (
            <div className="category-form__error-message">{errors.description}</div>
          )}
        </div>

        <div className="category-form__field">
          <label htmlFor="parent">Parent Category</label>
          <div className="category-form__parent-dropdown">
            <button
              type="button"
              className={`category-form__parent-button ${showParentDropdown ? 'active' : ''} ${category ? 'disabled' : ''}`}
              onClick={() => !category && setShowParentDropdown(!showParentDropdown)}
              disabled={!!category}
            >
              <span>
                {parentId 
                  ? parentCategories.find(cat => cat.id === parentId)?.name || 'Select parent category'
                  : 'Select parent category'}
              </span>
              {!category && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
            {showParentDropdown && !category && (
              <div className="category-form__parent-dropdown-content">
                <div 
                  className="category-form__parent-dropdown-item"
                  onClick={() => handleParentSelect(null)}
                >
                  No parent (Main category)
                </div>
                {availableParentCategories.length > 0 ? (
                  availableParentCategories.map(parent => (
                    <div
                      key={parent.id}
                      className="category-form__parent-dropdown-item"
                      onClick={() => handleParentSelect(parent.id)}
                    >
                      {parent.name}
                    </div>
                  ))
                ) : (
                  <div className="category-form__parent-dropdown-item category-form__parent-dropdown-item--disabled">
                    No available parent categories
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="category-form__field">
          <label htmlFor="status">Status</label>
          <div className="category-form__parent-dropdown">
            <button
              type="button"
              className={`category-form__parent-button ${showStatusDropdown ? 'active' : ''}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span>{status === 'active' ? 'Active' : 'Inactive'}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            {showStatusDropdown && (
              <div className="category-form__parent-dropdown-content">
                <div 
                  className="category-form__parent-dropdown-item"
                  onClick={() => handleStatusSelect('active')}
                >
                  Active
                </div>
                <div 
                  className="category-form__parent-dropdown-item"
                  onClick={() => handleStatusSelect('inactive')}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="category-form__field">
          <label htmlFor="image">Category Image</label>
          <div className={`category-form__image-upload ${errors.image ? 'error' : ''}`}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="category-form__image-input"
            />
            <label htmlFor="image" className="category-form__image-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {image ? 'Image selected' : 'Upload image'}
            </label>
          </div>
          {errors.image && (
            <div className="category-form__error-message">{errors.image}</div>
          )}
        </div>

        <div className="category-form__buttons">
          <button
            type="button"
            className="category-form__button category-form__button--cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="category-form__button category-form__button--submit"
            disabled={isSubmitting}
          >
            {category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};
