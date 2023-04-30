import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const TestTypeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.TEST_DATABASE_URL,
  synchronize: true, // IMPORTANT! Remove this before going into production
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default TestTypeOrmModuleOptions;