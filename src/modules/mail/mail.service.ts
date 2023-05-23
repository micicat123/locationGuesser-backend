import { MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async sendPasswordReset(user: User) {
    const token = await this.authService.generateToken(user);
    const url = `http://localhost:3000/auth-reset/${token}/${user.username}`;

    await this.mailerService.sendMail({
      to: user.username,
      subject: 'Geotagger - Password Reset ',
      template: __dirname + '/templates/confirmation.hbs',
      context: {
        name: user.firstName + ' ' + user.lastName,
        url,
      },
    });

    const hashedToken = await bcrypt.hash(token, 10);
    const id = user.id;
    await this.userService.create({
      id: user.id,
      resetToken: hashedToken,
    });
  }
}
