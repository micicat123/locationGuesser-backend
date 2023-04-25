import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from './env-vars.contant';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvVars.JWT_SECRET),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}