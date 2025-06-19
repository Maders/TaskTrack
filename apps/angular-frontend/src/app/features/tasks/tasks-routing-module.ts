import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskListPage } from './pages/task-list-page';
import { TaskCreatePage } from './pages/task-create-page';
import { TaskEditPage } from './pages/task-edit-page';

const routes: Routes = [
  { path: '', component: TaskListPage },
  { path: 'create', component: TaskCreatePage },
  { path: 'edit/:id', component: TaskEditPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
