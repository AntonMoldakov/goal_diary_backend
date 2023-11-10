import { Module } from '@nestjs/common';
import { HashingService } from './services/abstract/hashing.service';
import { BcryptService } from './services/bcrypt.service';

const providers = [
  {
    provide: HashingService,
    useClass: BcryptService,
  },
];
@Module({
  providers,
  exports: providers,
})
export class HashingModule {}
