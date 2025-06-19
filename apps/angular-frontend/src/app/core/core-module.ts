import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TaskService } from './services/task.service';
import { CategoryService } from './services/category.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [TaskService, CategoryService],
  exports: [HttpClientModule],
})
export class CoreModule {}
