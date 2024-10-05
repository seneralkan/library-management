import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BookService } from '../book/book.service';
import { BorrowedBookService } from '../borrowed-book/borrowed-book.service';
import { BookModule } from '../book/book.module';
import { BorrowedBookModule } from '../borrowed-book/borrowed-book.module';
import { BorrowedBookLogic } from '../borrowed-book/borrowed-book.logic';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'postgres'),
    BookModule,
    BorrowedBookModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    BookService,
    BorrowedBookService,
    BorrowedBookLogic,
  ],
  exports: [UserService],
})
export class UserModule {}
