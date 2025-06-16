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
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.', type: [Task] })
  findAll() {
    return this.tasksService.findAll();
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
  @UsePipes(new ZodValidationPipe(updateTaskSchema))
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
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
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
