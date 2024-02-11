import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CheckTaskResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  GetManyTasksResponseDto,
  UncheckTaskResponseDto,
} from '../dtos';
import { TasksService } from '../services/tasks.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserGuard } from 'src/common/types/user';
import { UserTaskGuard } from '../guards/user-task.guard';

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
  createTask(@Body() dto: CreateTaskRequestDto, @GetUser() user: UserGuard): Promise<CreateTaskResponseDto> {
    return this.tasksService.createTask(dto, user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-task/:id')
  @UseGuards(UserTaskGuard)
  @ApiOperation({ summary: 'Check task' })
  @ApiOkResponse({ type: () => CheckTaskResponseDto })
  checkTask(@Param('id', ParseUUIDPipe) id: string): Promise<CheckTaskResponseDto> {
    return this.tasksService.checkTask(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('uncheck-task/:id')
  @UseGuards(UserTaskGuard)
  @ApiOperation({ summary: 'Uncheck task' })
  @ApiOkResponse({ type: () => UncheckTaskResponseDto })
  uncheckTask(@Param('id', ParseUUIDPipe) id: string): Promise<UncheckTaskResponseDto> {
    return this.tasksService.uncheckTask(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('get-many-tasks')
  @ApiOperation({ summary: 'get my tasks' })
  @ApiOkResponse({ type: () => GetManyTasksResponseDto })
  getManyTasks(@GetUser() user: UserGuard): Promise<GetManyTasksResponseDto> {
    console.log('user', user);
    return this.tasksService.getManyTasks(user.email);
  }
}
