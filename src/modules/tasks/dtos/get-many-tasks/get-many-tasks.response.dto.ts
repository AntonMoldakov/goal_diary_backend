import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskResponseDto } from '../task.dto';
import { TaskEntity } from '../../entities/task.entity';
import { PaginatedResultDto } from 'src/common/pagination/pagination-response.dto';

export class GetManyTasksResponseDto extends PaginatedResultDto<TaskEntity> {
  @Expose()
  @ApiProperty({ type: TaskResponseDto, isArray: true })
  data: TaskEntity[];
}
