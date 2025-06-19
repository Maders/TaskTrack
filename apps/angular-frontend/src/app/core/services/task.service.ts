import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilters,
  TaskPagination,
} from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

// Interface for the backend response
interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = `${environment.apiBaseUrl}/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private http = inject(HttpClient);

  // Get all tasks with optional filters and pagination
  getTasks(
    filters?: TaskFilters,
    pagination?: { page: number; limit: number },
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<{ tasks: Task[]; pagination: TaskPagination }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status && filters.status.trim() !== '') {
        params = params.set('status', filters.status);
      }
      if (filters.title && filters.title.trim() !== '') {
        params = params.set('title', filters.title);
      }
      if (filters.categoryId && filters.categoryId.trim() !== '') {
        params = params.set('categoryId', filters.categoryId);
      }
      if (filters.dateRange) {
        params = params.set('dateRangeStart', filters.dateRange.start);
        params = params.set('dateRangeEnd', filters.dateRange.end);
      }
    }

    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('limit', pagination.limit.toString());
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<TaskListResponse>(this.apiUrl, { params }).pipe(
      map((response) => ({
        tasks: response.tasks,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        },
      })),
      tap((result) => this.tasksSubject.next(result.tasks))
    );
  }

  // Get a single task by ID
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
      })
    );
  }

  // Update an existing task
  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.map((t) =>
          t.id === id ? updatedTask : t
        );
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  // Delete a task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const filteredTasks = currentTasks.filter((t) => t.id !== id);
        this.tasksSubject.next(filteredTasks);
      })
    );
  }

  // Get tasks by category
  getTasksByCategory(categoryId: string): Observable<Task[]> {
    return this.http
      .get<TaskListResponse>(`${this.apiUrl}?categoryId=${categoryId}`)
      .pipe(map((response) => response.tasks));
  }

  // Update task status
  updateTaskStatus(
    id: string,
    status: 'To Do' | 'In Progress' | 'Done'
  ): Observable<Task> {
    return this.updateTask(id, { status });
  }

  // Assign category to task
  assignCategory(taskId: string, categoryId: string | null): Observable<Task> {
    return this.updateTask(taskId, { categoryId });
  }
}
