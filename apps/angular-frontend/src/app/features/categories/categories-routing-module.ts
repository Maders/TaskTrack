import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryListPageComponent } from './pages/category-list-page/category-list-page.component';
import { CategoryCreatePageComponent } from './pages/category-create-page/category-create-page.component';
import { CategoryEditPageComponent } from './pages/category-edit-page/category-edit-page.component';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: CategoryListPageComponent,
  },
  {
    path: 'create',
    component: CategoryCreatePageComponent,
  },
  {
    path: ':id/edit',
    component: CategoryEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(CATEGORIES_ROUTES)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
