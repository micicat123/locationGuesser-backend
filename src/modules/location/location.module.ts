import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import { Guess } from 'src/entities/guess.entity';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';

@Module({
    imports: [TypeOrmModule.forFeature([Location, Guess, User]),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    secret: configService.get(EnvVars.JWT_SECRET),
                    signOptions: { expiresIn: '1h' },
                }),  
            }),  
    ],
    providers: [LocationService, TypeOrmModule, AuthService],
    controllers: [LocationController]
})
export class LocationModule {}
  
