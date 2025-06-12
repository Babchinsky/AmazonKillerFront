export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId: string | null;
  status?: 'active' | 'inactive';
  role?: 'parent' | 'child';
  createdAt: string;
  updatedAt: string;
  rowVersion: string;
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'rowVersion'>;

export interface CategoryPropertyKeys {
  propertyKeys: string[];
  activePropertyKeys: string[];
} 