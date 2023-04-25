import { EnvVars } from './../../common/constants/env-vars.contant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../../entities/user.entity';
import { JwtConfigModule } from 'src/common/constants/jwtModule.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
