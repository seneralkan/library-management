import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User, Book } from '@models';

@Entity('borrowed_book')
export class BorrowedBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'bigint',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'book_id',
    type: 'bigint',
    nullable: false,
  })
  bookId: number;

  @Column({ type: 'date', nullable: false })
  borrowDate: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  returned: boolean;

  @Column({ type: 'date', nullable: true })
  returnDate: Date;

  @Column({ type: 'int', nullable: true })
  score: number;

  @ManyToOne(() => User, (user) => user.borrowedBooks, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrowedBooks, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
