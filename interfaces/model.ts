export interface Model {
  id: string;
  name: string;
  description: string;
  images: string[] | any[]; // Array of image sources
  gender: 'Male' | 'Female' | 'Kids';
  thumbnailImage: string | any; // Main thumbnail image
  age?: string; // Added age field
  password: string; // Password for editing/deleting
}

export interface ModelGalleryProps {
  models: Model[];
  onSelectModel: (model: Model) => void;
  selectedGender: string;
}

export interface ModelDetailProps {
  model: Model;
  onClose: () => void;
  onDressUp: (model: Model) => void;
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

export interface ModelFilterProps {
  selectedGender: string;
  onSelectGender: (gender: string) => void;
}
