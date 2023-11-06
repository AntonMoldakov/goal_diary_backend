import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export class UsersRepository extends Repository<UserEntity> {}
