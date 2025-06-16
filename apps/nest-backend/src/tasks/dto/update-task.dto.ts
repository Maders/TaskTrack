import { createTaskSchema } from './create-task.dto';
import { z } from 'zod';
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDtoSwagger } from './create-task.dto';

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

// This class is used for Swagger documentation only
export class UpdateTaskDtoSwagger extends PartialType(CreateTaskDtoSwagger) {}
