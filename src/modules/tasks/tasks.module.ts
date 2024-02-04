import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './controllers/tasks.controller';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  providers: [TasksService, TasksRepository, UsersRepository],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
