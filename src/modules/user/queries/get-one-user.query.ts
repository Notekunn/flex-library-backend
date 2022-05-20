import { UserEntity } from './../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './../repositories/user.repository';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
export class GetOneUserQuery extends Query<PaginationDto> {
  constructor(public readonly id: number) {
    super();
  }
}

@QueryHandler(GetOneUserQuery)
export class GetOneUserQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  execute(query: GetOneUserQuery) {
    const { id } = query;
    return this.userRepository.findOne({ where: { id } });
  }
}
