import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class DeleteOrderDetailCommand extends Command<number> {
  constructor(public readonly ids: number[]) {
    super();
  }
}

@CommandHandler(DeleteOrderDetailCommand)
export class DeleteOrderDetailCommandHandler implements ICommandHandler<DeleteOrderDetailCommand> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}
  async execute(command: DeleteOrderDetailCommand) {
    const { ids } = command;
    const query = this.orderDetailRepository.createQueryBuilder().softDelete().where('id IN (:...ids)', { ids });
    return query.execute();
  }
}
