import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';

@Module({
  imports: [TypeOrmModule.forFeature([Guess, User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get(EnvVars.JWT_SECRET),
                signOptions: { expiresIn: '1h' },
        }),
    }),],
  providers: [GuessService, TypeOrmModule, AuthService],
  controllers: [GuessController]
})
export class GuessModule {}
