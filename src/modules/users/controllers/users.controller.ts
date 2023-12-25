import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordRequestDto, UpdatePasswordResponseDto } from '../dtos';
import { UsersService } from '../services/users.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserEntity } from '../entities/user.entity';

@ApiTags('[v1] Users')
@ApiBearerAuth()
@Controller('v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('update-password')
  @ApiOperation({ summary: 'Update password' })
  @ApiBody({ type: () => UpdatePasswordRequestDto })
  @ApiOkResponse({ type: () => UpdatePasswordResponseDto })
  updatePassword(
    @Body() dto: UpdatePasswordRequestDto,
    @GetUser() user: UserEntity,
  ): Promise<UpdatePasswordResponseDto> {
    return this.usersService.updatePassword(dto, user.email);
  }
}
