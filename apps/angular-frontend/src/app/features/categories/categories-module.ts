import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListPageComponent } from './pages/category-list-page/category-list-page.component';
import { CategoryCreatePageComponent } from './pages/category-create-page/category-create-page.component';
import { CategoryEditPageComponent } from './pages/category-edit-page/category-edit-page.component';
import { CATEGORIES_ROUTES } from './categories-routing-module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CATEGORIES_ROUTES),
    CategoryListComponent,
    CategoryFormComponent,
    CategoryListPageComponent,
    CategoryCreatePageComponent,
    CategoryEditPageComponent,
  ],
})
export class CategoriesModule {}
