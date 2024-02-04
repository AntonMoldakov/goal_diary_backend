import { BaseEntity } from 'src/common/entites/base.entity';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskType } from '../tasks.types';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  title: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.DEFAULT,
  })
  type: TaskType;

  @Column('boolean', { default: false })
  checked: boolean;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  checkedAt?: Date;
}
