import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreBookDto } from '../dto/create-store-book.dto';
import { BookshelfEntity } from '../entities/bookshelf.entity';
import { GetOneStoreQuery } from '../queries/get-one-store.query';
import { StoreBookRepository } from '../repositories/storeBook.repository';

export class CreateStoreBookCommand extends Command<CreateStoreBookDto> {
  constructor(public readonly dto: CreateStoreBookDto) {
    super();
  }
}
@CommandHandler(CreateStoreBookCommand)
export class CreateStoreBookHandler implements ICommandHandler<CreateStoreBookCommand> {
  constructor(
    @InjectRepository(BookshelfEntity) private readonly storeBookRepository: StoreBookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateStoreBookCommand) {
    const { dto } = command;
    const store = await this.queryBus.execute(new GetOneStoreQuery(dto.storeId));
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const storeBook = this.storeBookRepository.create(dto);
    return await this.storeBookRepository.save(storeBook);
  }
}
