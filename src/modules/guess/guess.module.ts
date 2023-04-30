import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from '../../entities/guess.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../../entities/user.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess, User]), 
    JwtConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [GuessService, TypeOrmModule, AuthService, JwtStrategy],
  controllers: [GuessController]
})
export class GuessModule {}
