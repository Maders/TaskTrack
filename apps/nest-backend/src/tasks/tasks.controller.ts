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
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  CreateTaskDtoSwagger,
  createTaskSchema,
} from './dto/create-task.dto';
import {
  UpdateTaskDto,
  UpdateTaskDtoSwagger,
  updateTaskSchema,
} from './dto/update-task.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDtoSwagger })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filtering' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['To Do', 'In Progress', 'Done'],
  })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'dateRangeStart', required: false, type: String })
  @ApiQuery({ name: 'dateRangeEnd', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Return filtered tasks.',
    type: [Task],
  })
  findAll(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('title') title?: string,
    @Query('dateRangeStart') dateRangeStart?: string,
    @Query('dateRangeEnd') dateRangeEnd?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    const filters = {
      status: status || undefined,
      categoryId: categoryId || undefined,
      title: title || undefined,
      dateRangeStart: dateRangeStart || undefined,
      dateRangeEnd: dateRangeEnd || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    };

    const pagination = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    };

    return this.tasksService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', description: 'The id of the task' })
  @ApiResponse({ status: 200, description: 'Return the task.', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'The id of the task' })
  @ApiBody({ type: UpdateTaskDtoSwagger })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'The id of the task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
