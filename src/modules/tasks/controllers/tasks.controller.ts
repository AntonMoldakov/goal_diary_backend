import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CheckTaskRequestDto,
  CheckTaskResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  UncheckTaskRequestDto,
  UncheckTaskResponseDto,
} from '../dtos';
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

  @HttpCode(HttpStatus.OK)
  @Post('check-task')
  @ApiOperation({ summary: 'Check task' })
  @ApiBody({ type: () => CheckTaskRequestDto })
  @ApiOkResponse({ type: () => CheckTaskResponseDto })
  checkTask(@Body() dto: CheckTaskRequestDto): Promise<CheckTaskResponseDto> {
    return this.tasksService.checkTask(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('uncheck-task')
  @ApiOperation({ summary: 'Uncheck task' })
  @ApiBody({ type: () => UncheckTaskRequestDto })
  @ApiOkResponse({ type: () => UncheckTaskResponseDto })
  uncheckTask(@Body() dto: UncheckTaskRequestDto): Promise<UncheckTaskResponseDto> {
    return this.tasksService.uncheckTask(dto);
  }
}
