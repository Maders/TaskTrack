import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-create-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <app-task-form
        (taskSaved)="onTaskSaved($event)"
        (cancelled)="onCancelled()"
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

  onTaskSaved(taskData: CreateTaskDto | UpdateTaskDto): void {
    const createTaskData = taskData as CreateTaskDto;
    this.taskService.createTask(createTaskData).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        alert('Failed to create task');
      },
    });
  }

  onCancelled(): void {
    this.router.navigate(['/tasks']);
  }
}
