import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from '../../../../shared/models/task.model';
import {
  ErrorHandlerService,
  FormValidationErrors,
} from '../../../../core/services/error-handler.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-task-create-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p class="mt-2 text-sm text-gray-600">
          Add a new task to your task manager
        </p>
      </div>

      <app-task-form
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
export class TaskCreatePageComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);
  private toastService = inject(ToastService);

  onTaskSaved(taskData: CreateTaskDto | UpdateTaskDto): void {
    // For create page, we know it's a CreateTaskDto
    const createTaskData = taskData as CreateTaskDto;

    this.taskService.createTask(createTaskData).subscribe({
      next: (task) => {
        console.log('Task created successfully:', task);
        this.toastService.success('Task created successfully!');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error creating task:', error);

        // Handle validation errors
        const errorResult = this.errorHandler.handleError(error);

        if (errorResult.validationErrors) {
          // Pass validation errors to the form component
          const taskFormComponent = (this as any).taskForm;
          if (taskFormComponent && taskFormComponent.setValidationErrors) {
            taskFormComponent.setValidationErrors(errorResult.validationErrors);
          }
        } else {
          // Handle general errors (you might want to show a toast notification)
          console.error('General error:', errorResult.message);
        }
      },
    });
  }

  onCancelled(): void {
    this.router.navigate(['/tasks']);
  }
}
