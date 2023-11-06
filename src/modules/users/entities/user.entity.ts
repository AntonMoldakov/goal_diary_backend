import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity {
  @Column()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
