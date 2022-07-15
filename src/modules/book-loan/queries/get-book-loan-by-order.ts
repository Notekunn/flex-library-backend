import { OrderEntity } from '@modules/order/entities/order.entity';
import { GetOneOrderQuery } from '@modules/order/queries/get-one-order.query';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { GetStoreByOwnerQuery } from '@modules/store/queries/get-store-by-owner.query';
import { Query } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookLoanResponseDto } from '../dto/book-loan-response.dto';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';

export class GetBookLoanByOrderQuery extends Query<BookLoanResponseDto> {
  constructor(public readonly authorId: number, public readonly orderId: number) {
    super();
  }
}

@QueryHandler(GetBookLoanByOrderQuery)
export class GetBookLoanByOrderQueryHandler implements IQueryHandler<GetBookLoanByOrderQuery, BookLoanResponseDto> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(query: GetBookLoanByOrderQuery) {
    const { authorId, orderId } = query;
    const [order, store] = await Promise.all(
      [new GetOneOrderQuery(orderId), new GetStoreByOwnerQuery(authorId)].map((cmd) => this.queryBus.execute(cmd)) as [
        Promise<OrderEntity | null>,
        Promise<StoreEntity | null>,
      ],
    );
    if (!order) {
      throw new BadRequestException();
    }
    if (order?.store?.id != store?.id) {
      throw new ForbiddenException('exception.notStoreOwner');
    }
    const bookLoans = await this.bookLoanRepository.find({
      where: {
        order: {
          id: query.orderId,
        },
      },
      relations: ['order', 'book'],
    });
    return {
      order,
      bookLoans,
    } as unknown as BookLoanResponseDto;
  }
}
