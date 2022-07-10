import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { GetAllBookDto } from '../dto/get-all-book.dto';
import { BookStatus } from '@constants/book-status.enum';

export class GetAllBookQuery extends Query<BookEntity[]> {
  constructor(public readonly dto: GetAllBookDto) {
    super();
  }
}

@QueryHandler(GetAllBookQuery)
export class GetAllBookQueryHandler implements IQueryHandler<GetAllBookQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(query: GetAllBookQuery) {
    const { dto } = query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { q, sort, ...paginationDto } = dto;

    // const order = dto.toQueryOrder<BookEntity>();

    // const books = await this.bookRepository.find({
    //   ...paginationDto,
    //   where: {
    //     ...(q ? { name: ILike(`%${q}%`) } : {}),
    //   },
    //   relations: ['store', 'categories'],
    //   order,
    // });
    const builder = this.bookRepository.createQueryBuilder('book');
    builder
      .leftJoinAndSelect('book.store', 'store')
      .leftJoinAndSelect('book.categories', 'category')
      .loadRelationCountAndMap('book.numOfCopies', 'book.copies', 'copies', (qb) =>
        qb.andWhere('copies.status = :status', { status: BookStatus.AVAILABLE }),
      );
    if (q) {
      builder.where('name ILIKE :q', { q: `%${q}%` });
    }
    for (const sortItem of dto.toSortEntries<BookEntity>()) {
      builder.addOrderBy(`book.${sortItem[0]}`, sortItem[1]);
    }
    builder.take(dto.take);
    builder.skip(dto.skip);
    return builder.getMany();
  }
}
