import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';
import { CoreModule } from '../../core/core-module';

import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListPageComponent } from './pages/task-list-page/task-list-page.component';
import { TaskCreatePageComponent } from './pages/task-create-page/task-create-page.component';
import { TaskEditPageComponent } from './pages/task-edit-page/task-edit-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    TasksRoutingModule,
    TaskListComponent,
    TaskFormComponent,
    TaskListPageComponent,
    TaskCreatePageComponent,
    TaskEditPageComponent,
  ],
})
export class TasksModule {}
