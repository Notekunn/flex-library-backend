import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class GetUserByEmailQuery extends Query<UserEntity | null> {
  constructor(public readonly email: string) {
    super();
  }
}

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery, UserEntity | null> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  execute(query: GetUserByEmailQuery) {
    return this.userRepository.findOneBy({
      email: query.email,
    });
  }
}
