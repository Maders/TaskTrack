import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskListPageComponent } from './pages/task-list-page/task-list-page.component';
import { TaskCreatePageComponent } from './pages/task-create-page/task-create-page.component';
import { TaskEditPageComponent } from './pages/task-edit-page/task-edit-page.component';

const routes: Routes = [
  { path: '', component: TaskListPageComponent },
  { path: 'create', component: TaskCreatePageComponent },
  { path: 'edit/:id', component: TaskEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
