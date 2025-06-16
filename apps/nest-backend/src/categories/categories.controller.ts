import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  CreateCategoryDtoSwagger,
  createCategorySchema,
} from './dto/create-category.dto';
import {
  UpdateCategoryDto,
  UpdateCategoryDtoSwagger,
  updateCategorySchema,
} from './dto/update-category.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { AbstractCategoriesService } from './interfaces/categories.service.interface';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: AbstractCategoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDtoSwagger })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiResponse({
    status: 200,
    description: 'Return the category.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiBody({ type: UpdateCategoryDtoSwagger })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
