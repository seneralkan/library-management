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
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserReturnBookRequestDto } from './dtos/user-return-book.request.dto';

@Controller('/users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  async getAllUserHandler(@Res() reply: FastifyReply) {
    const users = await this.service.findAll();
    reply.send(users);
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by id' })
  async getUserByIdHandler(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.service.findOneWithBorrowHistory(userId);
    reply.send(user);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  async createUserHandler(
    @Body() data: UserCreateDto,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.service.create(data);
    reply.send(user);
  }

  @Post('/:userId/borrow/:bookId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Borrow book' })
  async borrowBookHandler(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.service.borrowBook(userId, bookId);
    reply.send(user);
  }

  @Post(':userId/return/:bookId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Return book' })
  async returnBook(
    @Param('userId') userId: number,
    @Param('bookId') bookId: number,
    @Body() req: UserReturnBookRequestDto,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.service.returnBook(userId, bookId, req.score);
    reply.send(user);
  }
}
