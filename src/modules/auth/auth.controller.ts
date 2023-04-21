import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: UserLoginDto, @Res({passthrough: true}) response : Response) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    return this.authService.login(user, response);
  }

  @Post('register')
  async register(@Body() dto: UserRegisterDto) {
    return this.authService.register(dto.username, dto.password, dto.passwordConfirm, dto.firstName, dto.lastName);
  }
}
