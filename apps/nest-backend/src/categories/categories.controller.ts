import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
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
  ApiQuery,
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
  @ApiOperation({
    summary: 'Get all categories with optional filtering and pagination',
  })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['title', 'createdAt', 'updatedAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return filtered categories.',
    type: [Category],
  })
  findAll(
    @Query('title') title?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const filters = {
      title: title || undefined,
    };

    const sorting = {
      sortBy: sortBy || 'title',
      sortOrder: (sortOrder === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
    };

    const pagination = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    };

    return this.categoriesService.findAll(filters, sorting, pagination);
  }

  @Get('task-counts')
  @ApiOperation({ summary: 'Get task counts by category' })
  @ApiResponse({
    status: 200,
    description: 'Return task counts for each category.',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
    },
  })
  getTaskCounts() {
    return this.categoriesService.getTaskCountsByCategory();
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
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        affectedTasksCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
