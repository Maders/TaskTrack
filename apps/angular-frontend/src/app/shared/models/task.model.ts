export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: 'To Do' | 'In Progress' | 'Done';
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string | null;
  dueDate: string | null;
  status: 'To Do' | 'In Progress' | 'Done';
  categoryId: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: 'To Do' | 'In Progress' | 'Done';
  categoryId?: string | null;
}

export interface TaskFilters {
  status?: 'To Do' | 'In Progress' | 'Done';
  dateRange?: {
    start: string;
    end: string;
  };
  title?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
