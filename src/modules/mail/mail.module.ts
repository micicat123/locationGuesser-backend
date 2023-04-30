import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from '../../entities/guess.entity';
import { Log } from '../../entities/Log.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User, Guess, Log]), JwtConfigModule],
  providers: [MailService, AuthService, UserService]
})
export class MailModule {}
