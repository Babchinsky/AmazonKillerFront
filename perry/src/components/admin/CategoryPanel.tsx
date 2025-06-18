import React, { useState, ChangeEvent, useEffect, useRef, useMemo } from 'react';
import AdminInput from './AdminInput';
import { ConfirmModal } from '../common/ConfirmModal';
import { CategoryForm } from './CategoryForm';
import './CategoryPanel.scss';
import { ADMIN_TOKEN } from '../../utils/auth/authToken';
import { Category } from '../../types/admin/category';

interface CategoryPanelProps {
  // Добавим пропсы позже при необходимости
}

export const CategoryPanel: React.FC<CategoryPanelProps> = () => {
  const initialCategories: Category[] = [];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [newCategoryParentId, setNewCategoryParentId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/categories`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response:', JSON.stringify(data, null, 2));
        
        // Check if data has items property (new API structure)
        const itemsArray = data.items || data;
        
        const categoriesFromApi = itemsArray.map((category: any) => {
          console.log('Processing category:', category);
          return {
            id: category.id,
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
            parentId: category.parentId,
            role: category.parentId ? 'child' : 'parent',
            status: category.status === 0 ? 'active' : 'inactive',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rowVersion: category.rowVersion
          };
        });
        console.log('Mapped categories:', categoriesFromApi);
        setCategories(categoriesFromApi);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const getParentCategories = () => {
    return categories.filter(category => category.role === 'parent');
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter(category => category.parentId === parentId);
  };

  const filteredCategories = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchLower);
      
      // Если это родительская категория, проверяем также её подкатегории
      if (!category.parentId) {
        const hasMatchingChildren = getChildCategories(category.id).some(child => 
          child.name.toLowerCase().includes(searchLower)
        );
        return matchesSearch || hasMatchingChildren;
      }
      
      return matchesSearch;
    });
  }, [categories, searchValue]);

  const getFilteredMainCategories = () => {
    const searchLower = searchValue.toLowerCase();
    return categories.filter(category => {
      // Если это родительская категория
      if (!category.parentId) {
        // Проверяем, соответствует ли сама категория поиску
        const matchesParent = category.name.toLowerCase().includes(searchLower);
        
        // Проверяем, есть ли у категории подкатегории, соответствующие поиску
        const hasMatchingChildren = getChildCategories(category.id).some(child => 
          child.name.toLowerCase().includes(searchLower)
        );

        return matchesParent || hasMatchingChildren;
      }
      return false;
    });
  };

  const getFilteredChildCategories = (parentId: string) => {
    const searchLower = searchValue.toLowerCase();
    return categories.filter(category => 
      category.parentId === parentId && 
      category.name.toLowerCase().includes(searchLower)
    );
  };

  const filteredMainCategories = getFilteredMainCategories();

  const toggleCategoryExpand = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategoryItem = (category: Category) => {
    const children = searchValue ? getFilteredChildCategories(category.id) : getChildCategories(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const isExpanded = expandedCategories.includes(category.id);
    
    return (
      <div key={category.id}>
        <div 
          className={`category-panel__table-row ${isSelected ? 'active' : ''}`}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="category-panel__table-cell">
            {children.length > 0 && (
              <svg
                className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}
                onClick={(e) => toggleCategoryExpand(category.id, e)}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            <input 
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(category.id);
              }}
            />
            <span className={category.role === 'parent' ? 'parent' : 'child'}>
              {category.name}
            </span>
          </div>
        </div>
        {children.length > 0 && (
          <div className={`category-panel__subcategories ${isExpanded ? 'expanded' : ''}`}>
            {children.map(child => {
              const isChildSelected = selectedCategory?.id === child.id;
              return (
                <div 
                  key={child.id}
                  className={`category-panel__table-row ${isChildSelected ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(child)}
                >
                  <div className="category-panel__table-cell">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(child.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(child.id);
                      }}
                    />
                    <span className="child">{child.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const parentCategories = getParentCategories();

  const handleFormSubmit = (categoryData: Category) => {
    if (editingCategory) {
      // Обновление существующей категории
      setCategories(prev => prev.map(cat => {
        if (cat.id === editingCategory.id) {
          return categoryData;
        }
        return cat;
      }));

      // Обновляем выбранную категорию, если она была изменена
      setSelectedCategory(categoryData);
      setShowForm(false);
      setEditingCategory(undefined);
    } else {
      // Добавление новой категории
      setCategories(prev => [...prev, categoryData]);
      
      // Если это дочерняя категория, выбираем её родителя
      if (categoryData.parentId) {
        const parentCategory = categories.find(cat => cat.id === categoryData.parentId);
        if (parentCategory) {
          setSelectedCategory(parentCategory);
        }
      } else {
        // Если это родительская категория, выбираем её
        setSelectedCategory(categoryData);
      }
      
      // Закрываем форму после успешного создания
      setShowForm(false);
    }
  };

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      // Если категория уже выбрана, удаляем её и все её дочерние категории
      if (prev.includes(categoryId)) {
        const childrenIds = new Set<string>();
        const addChildrenRecursively = (parentId: string) => {
          categories.forEach(cat => {
            if (cat.parentId === parentId) {
              childrenIds.add(cat.id);
              addChildrenRecursively(cat.id);
            }
          });
        };
        addChildrenRecursively(categoryId);
        
        return prev.filter(id => id !== categoryId && !childrenIds.has(id));
      }
      
      // Если категория не выбрана, добавляем её
      return [...prev, categoryId];
    });
  };

  const handleDeleteClick = (categoryId: string | string[]) => {
    // Если передан массив ID (множественное удаление через чекбоксы)
    if (Array.isArray(categoryId)) {
      setCategoryToDelete(categoryId[0]);
    } else {
      // Если передан один ID (удаление через кнопку Delete)
      setCategoryToDelete(categoryId);
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      // Определяем список ID категорий для удаления
      const categoriesToDelete = new Set<string>();
      
      // Если есть выбранные категории через чекбоксы, используем их
      // В противном случае используем categoryToDelete
      const selectedIds = selectedCategories.length > 0 ? selectedCategories : [categoryToDelete];
      
      // Добавляем выбранные категории и их дочерние элементы
      selectedIds.forEach(id => {
        categoriesToDelete.add(id);
        // Добавляем все дочерние категории рекурсивно
        const addChildrenRecursively = (parentId: string) => {
          categories.forEach(cat => {
            if (cat.parentId === parentId) {
              categoriesToDelete.add(cat.id);
              addChildrenRecursively(cat.id);
            }
          });
        };
        addChildrenRecursively(id);
      });

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/categories/delete-many`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: Array.from(categoriesToDelete)
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Ответ сервера:', errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        // Обновляем список категорий только после успешного удаления на сервере
        setCategories(prev => {
          const newCategories = prev.filter(cat => !categoriesToDelete.has(cat.id));
          // Если удалили все категории или удалили текущую выбранную категорию
          if (newCategories.length === 0 || 
              (selectedCategory && categoriesToDelete.has(selectedCategory.id))) {
            setSelectedCategory(null);
          }
          return newCategories;
        });

        // Очищаем выбранные категории
        setSelectedCategories([]);
      } catch (error) {
        console.error('Ошибка при удалении категорий:', error);
      }
    }
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCategorySelect = (category: Category) => {
    // Проверяем, существует ли еще эта категория
    if (categories.some(cat => cat.id === category.id)) {
      setSelectedCategory(category);
      setShowCategoriesDropdown(false);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleAddClick = (parentId?: string) => {
    setNewCategoryParentId(parentId || null);
    setShowForm(true);
  };

  return (
    <div className="category-panel">
      <div className="category-panel__header">
        <div className="category-panel__controls-group">
          <button 
            className="category-panel__add-button"
            onClick={() => handleAddClick(selectedCategory?.role === 'parent' ? selectedCategory.id : undefined)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {selectedCategory?.role === 'parent' ? 'Add subcategory' : 'Add category'}
          </button>

          <div className="category-panel__categories-dropdown" ref={dropdownRef}>
            <button
              className={`category-panel__categories-dropdown-button ${showCategoriesDropdown ? 'active' : ''}`}
              onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
            >
              <span>{selectedCategory ? selectedCategory.name : 'Select category'}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 6L8 11L14 6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <div className={`category-panel__categories-dropdown-content ${showCategoriesDropdown ? 'active' : ''}`}>
              <div className="category-panel__categories-dropdown-list">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(category => (
                    <div 
                      key={category.id} 
                      className={`category-panel__categories-dropdown-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </div>
                  ))
                ) : (
                  <div className="category-panel__categories-dropdown-empty">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="category-panel__search">
          <AdminInput
            type="text"
            value={searchValue}
            onChange={handleSearch}
              placeholder="Type to search in categories..."
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
      
      <div className="category-panel__content">
        <div className="category-panel__categories-list">
          {categories.length === 0 ? (
            <div className="category-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No categories found. Click "Add category" to create your first category</p>
          </div>
          ) : filteredMainCategories.length === 0 ? (
            <div className="category-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No categories match your search</p>
            </div>
          ) : (
            filteredMainCategories.map(category => renderCategoryItem(category))
          )}
        </div>

        {selectedCategory ? (
          <div className="category-panel__category-details">
            <div className="category-panel__category-details-header">
              <h2>{selectedCategory.name}</h2>
            </div>

            {selectedCategory.imageUrl && (
              <div className="category-panel__category-details-image">
                <img src={selectedCategory.imageUrl} alt={selectedCategory.name} />
              </div>
            )}

            <div className="category-panel__category-details-description">
              {selectedCategory.description || 'No description provided'}
            </div>

            <div className="category-panel__category-details-info">
              <div className="category-panel__category-details-info-row">
                <span>Status</span>
                <span>{selectedCategory.status || 'active'}</span>
              </div>
              <div className="category-panel__category-details-info-row">
                <span>Role</span>
                <span>{selectedCategory.role || 'parent'}</span>
              </div>
              {selectedCategory.role === 'child' && selectedCategory.parentId && (
                <div className="category-panel__category-details-info-row">
                  <span>Parent category</span>
                  <span>{categories.find(cat => cat.id === selectedCategory.parentId)?.name || 'Unknown'}</span>
                </div>
              )}
              <div className="category-panel__category-details-info-row">
                <span>Created</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="category-panel__category-details-info-row">
                <span>Last modified</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="category-panel__category-details-actions">
              <button 
                className="edit"
                onClick={() => handleEditClick(selectedCategory)}
                disabled={selectedCategories.length > 1}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
              <button 
                className="delete"
                onClick={() => handleDeleteClick(selectedCategories.length > 1 ? selectedCategories : selectedCategory.id)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {selectedCategories.length > 1 ? `Delete (${selectedCategories.length})` : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <div className="category-panel__empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>Select a category to view its details</p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          message={selectedCategories.length > 1 
            ? `Are you sure you want to delete ${selectedCategories.length} categories?`
            : "Are you sure you want to delete this category?"}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {showForm && (
        <>
          <div className="category-form__overlay" onClick={() => {
            setShowForm(false);
            setEditingCategory(undefined);
            setNewCategoryParentId(null);
          }}></div>
          <div className="category-panel__modal" style={{ zIndex: 9999 }}>
            <div className="category-panel__modal-overlay" onClick={() => {
              setShowForm(false);
              setEditingCategory(undefined);
              setNewCategoryParentId(null);
            }} />
            <div className="category-panel__modal-content">
              <CategoryForm
                category={editingCategory}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCategory(undefined);
                  setNewCategoryParentId(null);
                }}
                parentCategories={parentCategories}
                initialParentId={newCategoryParentId}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
