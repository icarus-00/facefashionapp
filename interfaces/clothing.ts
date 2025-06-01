export interface ClothingItem {
  id: string;
  name: string;
  image: string | any;
  category: string;
  subCategory: string;
  description?: string;
  color?: string;
  password?: string;
}

export interface ClothingCategory {
  id: string;
  name: string;
  subCategories: ClothingSubCategory[];
}

export interface ClothingSubCategory {
  id: string;
  name: string;
  items: ClothingItem[];
}

export interface ClothingPickerProps {
  categories: ClothingCategory[];
  onSelectItem: (item: ClothingItem) => void;
  selectedCategory: string;
  selectedSubCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubCategory: (subCategoryId: string) => void;
  onEditItem?: (item: ClothingItem) => void;
  onDeleteItem?: (item: ClothingItem) => void;
}

export interface CategoryTabsProps {
  categories: ClothingCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export interface SubCategoryTabsProps {
  subCategories: ClothingSubCategory[];
  selectedSubCategory: string;
  onSelectSubCategory: (subCategoryId: string) => void;
}

export interface ClothingGridProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
  onEditItem?: (item: ClothingItem) => void;
  onDeleteItem?: (item: ClothingItem) => void;
}

export interface ModelPreviewProps {
  modelId: string;
  selectedItems: ClothingItem[];
}

export interface ClothingItemDetailProps {
  item: ClothingItem;
  onClose: () => void;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
}
