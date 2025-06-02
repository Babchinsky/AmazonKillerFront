import CategoryStatusType from "./category-status-type";


type CategoryType = {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  iconName?: string | null;
  status: CategoryStatusType;
  rowVersion: string;
};

export default CategoryType;