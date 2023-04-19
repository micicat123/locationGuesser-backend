import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import typeOrmModuleOptions from './config/orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { LocaionModule } from './src/modules/locaion/locaion.module';
import { LocaionModule } from './modules/locaion/locaion.module';
import { CommonModulesModule } from './common/common-modules/common-modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmModuleOptions,
    }),
    AuthModule,
    LocaionModule,
    CommonModulesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
