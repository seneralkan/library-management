import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@models';
import { UserCreateDto } from './dtos/user-create.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User, 'postgres')
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: UserCreateDto): Promise<User> {
    const user = new User();
    const newUser = Object.assign(user, data);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneWithBorrowHistory(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['borrowedBooks'],
    });
  }
}
