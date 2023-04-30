import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../../entities/user.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';
import { UserService } from '../user/user.service';
import { Guess } from '../../entities/guess.entity';
import { Log } from '../../entities/Log.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Guess, Log]), 
    JwtConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
