type CategoryTreeType = {
  id: string;
  name: string;
  status: string;
  children: CategoryTreeType[];
};

export default CategoryTreeType;