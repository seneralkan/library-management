import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { BookService } from './book.service';
import { BookCreateDto } from './dtos/book-create.dto';

@Controller('/books')
export class BookController {
  constructor(private service: BookService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all books' })
  async getAllBookHandler(@Res() reply: FastifyReply) {
    const books = await this.service.findAll();
    reply.send(books);
  }

  @Get('/:bookId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get book by id' })
  async getBookByIdHandler(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() reply: FastifyReply,
  ) {
    const book = await this.service.findOneWithoutAvailability(bookId);
    reply.send(book);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a book' })
  async createBookHandler(
    @Body() data: BookCreateDto,
    @Res() reply: FastifyReply,
  ) {
    const book = await this.service.create(data);
    reply.send(book);
  }
}
