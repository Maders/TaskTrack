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
    pagination?: { page: number; limit: number }
  ): Observable<{ tasks: Task[]; pagination: TaskPagination }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.title) params = params.set('title', filters.title);
      if (filters.categoryId)
        params = params.set('categoryId', filters.categoryId);
      if (filters.dateRange) {
        params = params.set('startDate', filters.dateRange.start);
        params = params.set('endDate', filters.dateRange.end);
      }
    }

    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('limit', pagination.limit.toString());
    }

    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
      map((tasks) => ({
        tasks,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: tasks.length, // This would come from headers in a real API
          totalPages: Math.ceil(tasks.length / (pagination?.limit || 10)),
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
    return this.http.get<Task[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  // Update task status
  updateTaskStatus(
    id: string,
    status: 'To Do' | 'In Progress' | 'Done'
  ): Observable<Task> {
    return this.updateTask(id, { status });
  }
}
