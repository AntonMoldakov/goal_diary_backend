import { Injectable } from '@nestjs/common';
import { UpdatePasswordRequestDto, UpdatePasswordResponseDto } from '../dtos';
import { UsersRepository } from '../users.repository';
import { HashingService } from 'src/common/modules/hashing/services/abstract/hashing.service';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository, private hashingService: HashingService) {}
  async updatePassword(
    { password }: UpdatePasswordRequestDto,
    email: string,
  ): Promise<UpdatePasswordResponseDto> {
    const user = await this.usersRepository.findOneBy({ email: email });

    const hashedPassword = await this.hashingService.hash(password);

    await this.usersRepository.update(user.id, { password: hashedPassword });

    return { status: true };
  }
}
