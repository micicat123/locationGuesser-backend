import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { Guess } from '../../entities/guess.entity';
import { Log } from '../../entities/Log.entity';
import { JwtConfigModule } from '../../common/constants/jwtModule.constant';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User, Guess, Log]), 
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtConfigModule,
            MailModule
        ],
    providers: [UserService, AuthService, MailService, JwtStrategy],  
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}

