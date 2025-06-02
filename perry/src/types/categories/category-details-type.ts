import CategoryType from "./category-type";


type CategoryDetailsType = CategoryType & {
  filters: Record<string, string[]>;
};

export default CategoryDetailsType;