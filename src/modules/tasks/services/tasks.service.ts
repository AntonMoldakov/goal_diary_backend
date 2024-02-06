import { Injectable } from '@nestjs/common';
import {
  CheckTaskRequestDto,
  CheckTaskResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  UncheckTaskRequestDto,
  UncheckTaskResponseDto,
} from '../dtos';
import { TasksRepository } from '../tasks.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { TaskEntity } from '../entities/task.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}
  async createTask(
    { title, description, type }: CreateTaskRequestDto,
    email: string,
  ): Promise<CreateTaskResponseDto> {
    const user = await this.usersRepository.findOneBy({ email });

    const newTask = new TaskEntity();

    newTask.id = randomUUID();
    newTask.title = title;
    newTask.description = description;
    newTask.type = type;
    newTask.userId = user.id;

    const task = await this.tasksRepository.save(newTask);

    return { task };
  }

  async checkTask({ id }: CheckTaskRequestDto): Promise<CheckTaskResponseDto> {
    const task = await this.tasksRepository.findOneBy({ id });

    task.checked = true;
    task.checkedAt = new Date();

    await this.tasksRepository.update(task.id, task);

    return { task };
  }

  async uncheckTask({ id }: UncheckTaskRequestDto): Promise<UncheckTaskResponseDto> {
    const task = await this.tasksRepository.findOneBy({ id });

    task.checked = false;
    task.checkedAt = null;

    await this.tasksRepository.update(task.id, task);

    return { task };
  }
}
