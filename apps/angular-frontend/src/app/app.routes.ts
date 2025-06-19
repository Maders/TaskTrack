import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks-module').then((m) => m.TasksModule),
  },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
];
