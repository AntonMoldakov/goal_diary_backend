import { Injectable } from '@nestjs/common';
import { CreateTaskRequestDto, CreateTaskResponseDto } from '../dtos';
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
    const user = await this.usersRepository.findOneBy({ email: email });

    const newTask = new TaskEntity();

    newTask.id = randomUUID();
    newTask.title = title;
    newTask.description = description;
    newTask.type = type;
    newTask.userId = user.id;

    const task = await this.tasksRepository.save(newTask);

    return { task };
  }
}
