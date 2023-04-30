import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../../entities/location.entity';
import { Guess } from '../../entities/guess.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../../entities/user.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Location, Guess, User]),
        JwtConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [LocationService, TypeOrmModule, AuthService, JwtStrategy],
    controllers: [LocationController]
})
export class LocationModule {}
  
