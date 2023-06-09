import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmModuleOptions from './config/orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { LocationModule } from './modules/location/location.module';
import { CommonModulesModule } from './common/common-modules/common-modules.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GuessModule } from './modules/guess/guess.module';
import { UploadModule } from './modules/upload/upload.module';
import { TestTypeOrmModuleOptions } from './config/test.rom.config';
import * as dotenv from 'dotenv';
dotenv.config();

const isTest = process.env.TEST === 'true';
const databaseConfig = isTest ? TestTypeOrmModuleOptions : typeOrmModuleOptions;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    LocationModule,
    CommonModulesModule,
    UserModule,
    MailModule,
    GuessModule,
    UploadModule,
  ],
  controllers: [],
})
export class AppModule {}
