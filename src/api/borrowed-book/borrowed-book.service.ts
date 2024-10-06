import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BorrowedBookRepository } from './borrowed-book.repository';
import { CreateBorrowedBookDto } from './dtos/create-borrowed-book.dto';
import { BorrowedBook } from '@models';

@Injectable()
export class BorrowedBookService {
  constructor(
    @Inject(forwardRef(() => BorrowedBookRepository))
    private readonly bookRepository: BorrowedBookRepository,
  ) {}

  async create(data: CreateBorrowedBookDto) {
    return await this.bookRepository.create(data);
  }

  async save(data: BorrowedBook) {
    return await this.bookRepository.save(data);
  }

  async findBorrowedBookByBookId(bookId: number) {
    return await this.bookRepository.findBorrowedBookByBookId(bookId);
  }
}
