import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { Guess } from 'src/entities/guess.entity';
import { Log } from 'src/entities/Log.entity';
import { JwtConfigModule } from 'src/common/constants/jwtModule.constant';

@Module({
    imports: [TypeOrmModule.forFeature([User, Guess, Log]), 
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtConfigModule,
            MailModule
        ],
    providers: [UserService, AuthService, MailService],  
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}

