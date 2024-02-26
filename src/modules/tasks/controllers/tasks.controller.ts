import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CheckTaskResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  DeleteTaskResponseDto,
  GetManyTasksResponseDto,
  UncheckTaskResponseDto,
} from '../dtos';
import { TasksService } from '../services/tasks.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserGuard } from 'src/common/types/user';
import { UserTaskGuard } from '../guards/user-task.guard';
import { Pagination, PaginationParams } from 'src/common/pagination/paginations-params.decorator';
import { PaginationRequestQueryDto } from 'src/common/pagination/pagination-request.dto';

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
  @Delete('delete-task/:id')
  @UseGuards(UserTaskGuard)
  @ApiOperation({ summary: 'Delete task' })
  @ApiOkResponse({ type: () => DeleteTaskResponseDto })
  deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteTaskResponseDto> {
    return this.tasksService.deleteTask(id);
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
  @ApiQuery({ type: () => PaginationRequestQueryDto })
  @ApiOkResponse({ type: () => GetManyTasksResponseDto })
  getManyTasks(
    @PaginationParams() paginationParams: Pagination,
    @GetUser() user: UserGuard,
  ): Promise<GetManyTasksResponseDto> {
    return this.tasksService.getManyTasks(user.email, paginationParams);
  }
}
