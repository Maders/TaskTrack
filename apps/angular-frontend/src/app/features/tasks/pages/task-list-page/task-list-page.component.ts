import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, TaskListComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <app-task-list [initialFilters]="initialFilters"></app-task-list>
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
export class TaskListPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  initialFilters: { categoryId?: string } = {};

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['categoryId']) {
        this.initialFilters = { categoryId: params['categoryId'] };
      }
    });
  }
}
