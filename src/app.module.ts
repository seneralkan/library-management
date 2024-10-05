import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { envVariableSchema } from './config/env-variable.schema';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ApiModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: envVariableSchema,
      validationOptions: {
        allowUnknown: true,
      },
      ignoreEnvFile: false,
      envFilePath: ['.env'],
    }),
  ],
})
export class AppModule {}
