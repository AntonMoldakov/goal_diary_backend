import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskType } from '../tasks.types';

export class TaskResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  description: string | null;

  @ApiProperty({
    enum: TaskType,
    default: TaskType.DEFAULT,
  })
  @Expose()
  type: TaskType;

  @ApiProperty()
  checked: boolean;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  checkedAt?: Date | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  updatedAt?: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  deletedAt?: Date | null;
}
