import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    secret: configService.get(EnvVars.JWT_SECRET),
                    signOptions: { expiresIn: '1h' },
                }),
            }),],
  providers: [MailService, AuthService, UserService]
})
export class MailModule {}
