import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoriesRoutingModule } from './categories-routing-module';
import { CoreModule } from '../../core/core-module';

import { CategoryListComponent } from './components/category-list/category-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    CategoriesRoutingModule,
    CategoryListComponent,
  ],
})
export class CategoriesModule {}
