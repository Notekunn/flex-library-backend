import { UserEntity } from './../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './../repositories/user.repository';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Query } from '@nestjs-architects/typed-cqrs';
export class GetOneUserQuery extends Query<UserEntity> {
  constructor(public readonly id: number, public readonly withStore = false) {
    super();
  }
}

@QueryHandler(GetOneUserQuery)
export class GetOneUserQueryHandler implements IQueryHandler<GetOneUserQuery, UserEntity | null> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(query: GetOneUserQuery) {
    const { id, withStore } = query;
    return await this.userRepository.findOne({
      where: { id },
      relations: withStore ? ['store'] : [],
    });
  }
}
