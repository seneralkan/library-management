import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserCreateDto } from './dtos/user-create.dto';
import { BorrowedBookService } from '../borrowed-book/borrowed-book.service';
import { BookService } from '../book/book.service';
import { UserWithBorrowHistoryDto } from './dtos/user-with-borrow-history.dto';
import { BookIsNotAvailable } from '../book/exceptions/book-is-not-available.exception';
import { UserDontHaveBorrowedBookException } from './exceptions/user-dont-have-borrowed-book.exception';
import { BorrowedBookLogic } from '../borrowed-book/borrowed-book.logic';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
    @Inject(forwardRef(() => BorrowedBookService))
    private readonly borrowedBookService: BorrowedBookService,
    @Inject(forwardRef(() => BorrowedBookLogic))
    private readonly borrowedBookLogic: BorrowedBookLogic,
  ) {}

  async create(data: UserCreateDto) {
    return await this.userRepository.create(data);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async findOneWithBorrowHistory(
    id: number,
  ): Promise<UserWithBorrowHistoryDto> {
    const user = await this.userRepository.findOneWithBorrowHistory(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    return {
      id: user.id,
      name: user.name,
      books: {
        past: user.borrowedBooks
          .filter((book) => book.returned)
          .map((book) => {
            return {
              name: book.book.name,
              userScore: book.score,
            };
          }),
        present: user.borrowedBooks
          .filter((book) => !book.returned)
          .map((book) => {
            return { name: book.book.name };
          }),
      },
    };
  }

  async borrowBook(userId: number, bookId: number) {
    const user = await this.userRepository.findOneWithBorrowHistory(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    const book = await this.bookService.findOne(bookId);
    if (!book.available) {
      throw new BookIsNotAvailable(book.id, book.name);
    }

    const borrowedBook = await this.borrowedBookService.create({
      userId: user.id,
      bookId: book.id,
      borrowDate: new Date(),
      returned: false,
    });

    book.available = false;
    await this.bookService.save(book);
    user.borrowedBooks = [...user.borrowedBooks, borrowedBook];
    return await this.userRepository.save(user);
  }

  async returnBook(userId: number, bookId: number, score: number) {
    const user = await this.userRepository.findOneWithBorrowHistory(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    const book = await this.bookService.findOne(bookId);
    const borrowedBook = user.borrowedBooks.find(
      (borrowedBook) =>
        borrowedBook.bookId === book.id && !borrowedBook.returned,
    );

    if (!borrowedBook) {
      throw new UserDontHaveBorrowedBookException(user.name, book.name);
    }

    try {
      borrowedBook.returned = true;
      borrowedBook.score = score;
      borrowedBook.returnDate = new Date();
      book.available = true;
      borrowedBook.book = book;
      await this.borrowedBookService.save(borrowedBook);

      const allBorrowedBooks =
        await this.borrowedBookService.findBorrowedBookByBookId(book.id);

      const averageScore =
        this.borrowedBookLogic.calculateAverageScore(allBorrowedBooks);
      book.score = averageScore;
      await this.bookService.save(book);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
