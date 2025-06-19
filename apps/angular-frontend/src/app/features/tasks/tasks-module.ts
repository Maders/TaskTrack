import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';

import { TaskList } from './components/task-list';
import { TaskForm } from './components/task-form';
import { TaskListPage } from './pages/task-list-page';
import { TaskCreatePage } from './pages/task-create-page';
import { TaskEditPage } from './pages/task-edit-page';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    TaskList,
    TaskForm,
    TaskListPage,
    TaskCreatePage,
    TaskEditPage,
  ],
})
export class TasksModule {}
