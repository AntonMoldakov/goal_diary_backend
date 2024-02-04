import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from '../task.dto';
import { Expose } from 'class-transformer';
import { TaskEntity } from '../../entities/task.entity';

export class CreateTaskResponseDto {
  @Expose()
  @ApiProperty({ type: TaskResponseDto })
  task: TaskEntity;
}
