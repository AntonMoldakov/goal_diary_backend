import { Injectable } from '@nestjs/common';
import {
  CheckTaskResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  DeleteTaskResponseDto,
  GetManyTasksResponseDto,
  UncheckTaskResponseDto,
} from '../dtos';
import { TasksRepository } from '../tasks.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { TaskEntity } from '../entities/task.entity';
import { randomUUID } from 'crypto';
import { Pagination } from 'src/common/pagination/paginations-params.decorator';

@Injectable()
export class TasksService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}
  async createTask(
    { title, description, type }: CreateTaskRequestDto,
    userId: string,
  ): Promise<CreateTaskResponseDto> {
    const newTask = new TaskEntity();

    newTask.id = randomUUID();
    newTask.title = title;
    newTask.description = description;
    newTask.type = type;
    newTask.userId = userId;

    const task = await this.tasksRepository.save(newTask);

    return { task };
  }

  async deleteTask(id: string): Promise<DeleteTaskResponseDto> {
    await this.tasksRepository.delete(id);

    return { status: true };
  }

  async checkTask(id: string): Promise<CheckTaskResponseDto> {
    const task = await this.tasksRepository.findOneBy({ id });

    task.checked = true;
    task.checkedAt = new Date();

    await this.tasksRepository.update(task.id, task);

    return { task };
  }

  async uncheckTask(id: string): Promise<UncheckTaskResponseDto> {
    const task = await this.tasksRepository.findOneBy({ id });

    task.checked = false;
    task.checkedAt = null;

    await this.tasksRepository.update(task.id, task);

    return { task };
  }

  async getManyTasks(email: string, { page, limit, offset }: Pagination): Promise<GetManyTasksResponseDto> {
    const user = await this.usersRepository.findOneBy({ email });

    const [tasks, total] = await this.tasksRepository.findAndCount({
      where: { userId: user.id },
      take: limit,
      skip: offset,
    });

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
