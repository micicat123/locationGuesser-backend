import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';
import { Guess } from 'src/entities/guess.entity';
import { Log } from 'src/entities/Log.entity';
import { JwtConfigModule } from 'src/common/constants/jwtModule.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User, Guess, Log]), JwtConfigModule],
  providers: [MailService, AuthService, UserService]
})
export class MailModule {}
