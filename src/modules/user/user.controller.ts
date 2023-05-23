import {
  Body,
  Put,
  Req,
  UseGuards,
  Controller,
  BadRequestException,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserPasswordDto } from './dto/update-pass.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { EmailDto } from '../mail/dto/email.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { LogActionDto } from './dto/log-action.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResetUserPasswordDto } from './dto/reset-pass.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/best/:take/:page')
  async getPersonalBest(
    @Req() request: Request,
    @Param('take') take: number,
    @Param('page') page: number,
  ) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    return this.userService.getPersonalBest(id, take, page);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/guesses')
  async getAllGuesses(@Req() request: Request) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    return this.userService.getGuesses(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/info')
  async updateInfo(@Body() body: UpdateUserInfoDto, @Req() request: Request) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };

    return await this.userService.create({
      id,
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/pass')
  async updatePassword(
    @Body() body: UpdateUserPasswordDto,
    @Req() request: Request,
  ) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    const found = await this.userService.findBy({ id });

    if (!(await bcrypt.compare(body.currentPassword, (await found).password)))
      throw new BadRequestException('Current pasword is not correct.');
    if (body.newPassword !== body.confirmNewPassword)
      throw new BadRequestException('Passwords do not match!');

    const hashed = await bcrypt.hash(body.newPassword, 10);

    await this.userService.create({
      id,
      password: hashed,
    });
    return this.userService.findBy({ id });
  }

  //send email
  @Post('/send-email')
  async sendEmail(@Body() body: EmailDto) {
    const username = body.username;
    const user: User = await this.userService.findBy({ username });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    await this.mailService.sendPasswordReset(user);

    return { message: 'Email sent' };
  }

  //verify email
  @Get('/auth-email/:token/:username')
  async authenticateToken(
    @Param('token') token: string,
    @Param('username') username: string,
  ) {
    const found: User = await this.userService.findBy({ username });

    if (!(await bcrypt.compare(token, (await found).resetToken)))
      throw new BadRequestException('The reset token is invalid');

    try {
      const payload = await this.jwtService.verify(token);
      if (payload.sub !== found.id)
        throw new BadRequestException('The reset token is invalid');
      return payload;
    } catch (e) {
      throw new BadRequestException('The reset token is invalid');
    }
  }

  //reset password
  @Put('/reset-pass')
  async resetPassword(
    @Body() body: ResetUserPasswordDto,
    @Req() request: Request,
  ) {
    if (body.newPassword !== body.confirmNewPassword)
      throw new BadRequestException('Passwords do not match!');

    const hashed = await bcrypt.hash(body.newPassword, 10);
    const found: any = await this.userService.findBy({
      username: body.username,
    });
    await this.userService.create({
      id: found.id,
      password: hashed,
    });
    return this.userService.findBy({ username: body.username });
  }

  //log action
  @Post('/log-action')
  async logAction(@Body() body: LogActionDto, @Req() request: Request) {
    const id = await this.authService.userId(request);
    let found: User | null = null;
    if (id != -1) {
      found = await this.userService.findBy({ id });
    }
    await this.userService.logAction(body, found);
  }

  //get logged actions
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/admin/logs')
  async getLogs() {
    return await this.userService.getLogs();
  }
}
