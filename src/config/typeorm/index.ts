import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const TypeORMOptions: TypeOrmModuleAsyncOptions = {
  name: 'postgres',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('postgres.host'),
    port: parseInt(configService.get('postgres.port'), 10),
    username: configService.get('postgres.username'),
    password: configService.get('postgres.password'),
    database: configService.get('postgres.name'),
    entities: ['dist/src/models/*.entity.{js,ts}'],
    synchronize: true,
  }),
};
