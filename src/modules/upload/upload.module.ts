import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageUploadService } from './S3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Guess } from '../../entities/guess.entity';
import { Location } from '../../entities/location.entity';
import { LocationService } from '../location/location.service';
import { Log } from '../../entities/Log.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Guess, Location, Log]), 
    JwtConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [ImageUploadService, AuthService, UserService,TypeOrmModule, LocationService, JwtStrategy],
  controllers: [UploadController]
})
export class UploadModule {}
