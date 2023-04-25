import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageUploadService } from './S3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';
import { UserService } from '../user/user.service';
import { Guess } from 'src/entities/guess.entity';
import { Location } from 'src/entities/location.entity';
import { LocationService } from '../location/location.service';
import { Log } from 'src/entities/Log.entity';
import { JwtConfigModule } from 'src/common/constants/jwtModule.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User, Guess, Location, Log]), JwtConfigModule],
  providers: [ImageUploadService, AuthService, UserService,TypeOrmModule, LocationService],
  controllers: [UploadController]
})
export class UploadModule {}
