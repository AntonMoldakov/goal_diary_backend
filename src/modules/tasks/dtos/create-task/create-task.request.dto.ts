import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { TaskType } from '../../tasks.types';

export class CreateTaskRequestDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description?: string;

  @ApiProperty({ default: TaskType.DEFAULT })
  @IsEnum(TaskType)
  readonly type: TaskType;
}
