import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import { UpdateTaskDto, Task } from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div *ngIf="loading()" class="flex items-center justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <span class="ml-2 text-gray-600">Loading task...</span>
      </div>

      <div *ngIf="!loading() && !task()" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900">Task not found</h3>
        <p class="mt-1 text-sm text-gray-500">
          The task you're looking for doesn't exist.
        </p>
        <div class="mt-6">
          <button
            (click)="goBack()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>

      <app-task-form
        *ngIf="!loading() && task()"
        [task]="task()!"
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
export class TaskEditPageComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  loading = signal(true);
  task = signal<Task | null>(null);

  ngOnInit(): void {
    this.loadTask();
  }

  private loadTask(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.loading.set(false);
      return;
    }

    this.taskService.getTask(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.loading.set(false);
      },
    });
  }

  onTaskSaved(taskData: UpdateTaskDto): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) return;

    this.taskService.updateTask(taskId, taskData).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Failed to update task');
      },
    });
  }

  onCancelled(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
