import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from 'src/common/modules/config/config.service';

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.getString('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.getNumber('JWT_ACCESS_TOKEN_TTL'),
      },
    };
  }
}
