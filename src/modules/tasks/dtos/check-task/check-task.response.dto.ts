import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskResponseDto } from '../task.dto';
import { TaskEntity } from '../../entities/task.entity';

export class CheckTaskResponseDto {
  @Expose()
  @ApiProperty({ type: TaskResponseDto })
  task: TaskEntity;
}
