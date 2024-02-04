import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskRequestDto, CreateTaskResponseDto } from '../dtos';
import { TasksService } from '../services/tasks.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@ApiTags('[v1] Tasks')
@ApiBearerAuth()
@Controller('v1/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-task')
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: () => CreateTaskRequestDto })
  @ApiOkResponse({ type: () => CreateTaskResponseDto })
  createTask(@Body() dto: CreateTaskRequestDto, @GetUser() user: UserEntity): Promise<CreateTaskResponseDto> {
    return this.tasksService.createTask(dto, user.email);
  }
}
