import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowedBook } from 'src/models/borrowed-book.entity';
import { Repository } from 'typeorm';
import { CreateBorrowedBookDto } from './dtos/create-borrowed-book.dto';

@Injectable()
export class BorrowedBookRepository {
  constructor(
    @InjectRepository(BorrowedBook, 'postgres')
    private readonly bookRepository: Repository<BorrowedBook>,
  ) {}

  async create(data: CreateBorrowedBookDto): Promise<BorrowedBook> {
    const borrowedBook = this.bookRepository.create();
    const newBook = Object.assign(borrowedBook, data);
    await this.bookRepository.save(newBook);
    return newBook;
  }

  async findBorrowedBookByBookId(bookId: number): Promise<BorrowedBook[]> {
    return await this.bookRepository.find({ where: { bookId: bookId } });
  }

  async save(data: BorrowedBook): Promise<BorrowedBook> {
    return await this.bookRepository.save(data);
  }
}
