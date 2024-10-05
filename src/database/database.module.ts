import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMOptions } from '@config/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync(TypeORMOptions)],
})
export class DatabaseModule {}
