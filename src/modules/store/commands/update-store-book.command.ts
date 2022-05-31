import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStoreBookDto } from '../dto/update-store-book.dto';
import { BookshelfEntity } from '../entities/bookshelf.entity';
import { GetOneStoreBookQuery } from '../queries/get-one-store-book.query';
import { GetOneStoreQuery } from '../queries/get-one-store.query';
import { StoreBookRepository } from '../repositories/storeBook.repository';

export class UpdateStoreBookCommand extends Command<UpdateStoreBookDto> {
  constructor(public readonly id: number, public readonly dto: UpdateStoreBookDto) {
    super();
  }
}

@CommandHandler(UpdateStoreBookCommand)
export class UpdateStoreBookHandler implements ICommandHandler<UpdateStoreBookCommand> {
  constructor(
    @InjectRepository(BookshelfEntity) private readonly storeBookRepository: StoreBookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: UpdateStoreBookCommand) {
    const { id, dto } = command;
    const storeBook = await this.queryBus.execute(new GetOneStoreBookQuery(id));
    if (!storeBook) {
      throw new NotFoundException('StoreBook not found');
    }
    const store = await this.queryBus.execute(new GetOneStoreQuery(dto.storeId));
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    const newStoreBook = this.storeBookRepository.create(dto);
    return await this.storeBookRepository.save(newStoreBook);
  }
}
