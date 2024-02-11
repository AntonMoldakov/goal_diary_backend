import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { TasksRepository } from '../tasks.repository';
import { ErrorKeys } from 'src/common/types/errors-keys';

@Injectable()
export class UserTaskGuard implements CanActivate {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      params: { id },
    } = context.switchToHttp().getRequest();

    if (!user) {
      throw new NotFoundException(ErrorKeys.USER_DOES_NOT_EXIST);
    }

    if (!id) {
      throw new BadRequestException('Validation failed (id is required)');
    }

    if (!isUUID(id)) {
      throw new BadRequestException(`Validation failed (uuid is expected)`);
    }

    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(ErrorKeys.TASK_DOES_NOT_EXIST);
    }

    const isOwnedForUser = task.userId === user.id;

    return isOwnedForUser;
  }
}
