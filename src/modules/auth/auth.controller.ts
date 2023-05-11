import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    return this.authService.login(user, response);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return console.log('logged out');
  }

  @Post('register')
  async register(@Body() dto: UserRegisterDto) {
    return this.authService.register(
      dto.username,
      dto.password,
      dto.passwordConfirm,
      dto.firstName,
      dto.lastName,
    );
  }

  @Get('/admin')
  async chekckAdmin(@Req() request: Request) {
    let id: number;
    let found: User;

    id = await this.authService.userId(request);
    if (id == -1) {
      const response = {
        success: false,
        message: 'This user is not logged in',
        user: found,
      };
      return {
        body: response,
      };
    }

    found = await this.userService.findBy({ id });

    if (
      found.username == 'mici.zep@gmail.com' ||
      found.username == 'john.doe@gmail.com'
    ) {
      const response = {
        success: true,
        message: 'This user is an admin',
        user: found,
      };
      return { body: response };
    } else {
      const response = {
        success: false,
        message: 'This user is not an admin',
        user: found,
      };
      return { body: response };
    }
  }
}
