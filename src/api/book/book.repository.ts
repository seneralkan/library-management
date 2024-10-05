import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@models';
import { BookCreateDto } from './dtos/book-create.dto';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book, 'postgres')
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(data: BookCreateDto): Promise<Book> {
    const book = new Book();
    const newBook = Object.assign(book, data);
    await this.bookRepository.save(newBook);
    return newBook;
  }

  async save(book: Book): Promise<Book> {
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Partial<Book>[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.name'])
      .getMany();
  }

  async findOneWithoutAvailability(id: number): Promise<Book> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.name', 'book.score'])
      .where('id = :id', { id })
      .getOne();
  }

  async findOne(id: number): Promise<Book> {
    return await this.bookRepository.findOne({ where: { id } });
  }
}
