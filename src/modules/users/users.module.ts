import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { HashingModule } from 'src/common/modules/hashing/hashing.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HashingModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
