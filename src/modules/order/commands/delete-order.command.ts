import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

export class DeleteOrderCommand extends Command<number> {
  constructor(public readonly ids: number[]) {
    super();
  }
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
  ) {}
  async execute(command: DeleteOrderCommand) {
    const { ids } = command;
    const query = this.orderRepository.createQueryBuilder().softDelete().where('id IN (:...ids)', { ids });
    return query.execute();
  }
}
