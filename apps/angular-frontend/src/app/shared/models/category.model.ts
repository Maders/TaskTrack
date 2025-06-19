export interface Category {
  id: string;
  title: string;
  description: string | null;
}

export interface CreateCategoryDto {
  title: string;
  description: string | null;
}

export interface UpdateCategoryDto {
  title?: string;
  description?: string | null;
}
