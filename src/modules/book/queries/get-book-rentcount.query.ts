import { RedisKey } from '@constants/redis-key';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetBookRentCountQuery extends Query<number[]> {
  constructor(public readonly bookIds: number[]) {
    super();
  }
}

@QueryHandler(GetBookRentCountQuery)
export class GetBookRentCountQueryHandler implements IQueryHandler<GetBookRentCountQuery, number[]> {
  constructor(private readonly redisService: RedisService) {}
  async execute(query: GetBookRentCountQuery): Promise<number[]> {
    const rentCount = await this.redisService
      .getClient()
      .mget(...query.bookIds.map((bookId) => `${RedisKey.BookRentCount}:${bookId}`));
    return rentCount.map((c) => +(c || 0));
  }
}
