import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks-module').then((m) => m.TasksModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/categories/categories-module').then(
        (m) => m.CategoriesModule
      ),
  },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
];
