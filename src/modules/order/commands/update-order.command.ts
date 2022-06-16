import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

export class UpdateOrderCommand extends Command<UpdateOrderDto> {
  constructor(public readonly id: number, public readonly dto: UpdateOrderDto) {
    super();
  }
}

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderCommandHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
  ) {}
  async execute(command: UpdateOrderCommand) {
    const { id, dto } = command;
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const updatedOrder = await this.orderRepository.save({ ...order, ...dto });
    return updatedOrder;
  }
}
