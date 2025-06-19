import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  Task,
} from '../../../../shared/models/task.model';
import {
  ErrorHandlerService,
  FormValidationErrors,
} from '../../../../core/services/error-handler.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Edit Task</h1>
        <p class="mt-2 text-sm text-gray-600">Update task details</p>
      </div>

      <div *ngIf="loading()" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <div
        *ngIf="error()"
        class="mb-6 bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error() }}</p>
          </div>
        </div>
      </div>

      <app-task-form
        *ngIf="task()"
        [task]="task()"
        (taskSaved)="onTaskSaved($event)"
        (cancelled)="onCancelled()"
        #taskForm
      ></app-task-form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TaskEditPageComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);
  private toastService = inject(ToastService);

  // Signals
  loading = signal(true);
  task = signal<Task | null>(null);
  error = signal<string>('');

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.error.set('Task ID is required');
      this.loading.set(false);
    }
  }

  private loadTask(taskId: string): void {
    this.taskService.getTask(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading task:', error);
        const errorResult = this.errorHandler.handleError(error);
        this.error.set(errorResult.message);
        this.loading.set(false);
      },
    });
  }

  onTaskSaved(taskData: CreateTaskDto | UpdateTaskDto): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.error.set('Task ID is required');
      return;
    }

    // For edit page, we know it's an UpdateTaskDto
    const updateTaskData = taskData as UpdateTaskDto;

    this.taskService.updateTask(taskId, updateTaskData).subscribe({
      next: (task) => {
        console.log('Task updated successfully:', task);
        this.toastService.success('Task updated successfully!');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error updating task:', error);

        // Handle validation errors
        const errorResult = this.errorHandler.handleError(error);

        if (errorResult.validationErrors) {
          // Show toast for validation errors
          const errorMessages = Object.values(errorResult.validationErrors)
            .map((err) => err.serverError)
            .filter((msg) => msg)
            .join(', ');

          if (errorMessages) {
            this.toastService.error(`Validation failed: ${errorMessages}`);
          }

          // Pass validation errors to the form component
          const taskFormComponent = (this as any).taskForm;
          if (taskFormComponent && taskFormComponent.setValidationErrors) {
            taskFormComponent.setValidationErrors(errorResult.validationErrors);
          }
        } else {
          // Show general error toast
          this.toastService.error(
            errorResult.message || 'Failed to update task'
          );
        }
      },
    });
  }

  onCancelled(): void {
    this.router.navigate(['/tasks']);
  }
}
