import { BorrowedBook } from '@models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BorrowedBookLogic {
  calculateAverageScore(books: BorrowedBook[]) {
    const totalScore = books.reduce((sum, book) => sum + book.score, 0);
    return totalScore / books.length;
  }
}
