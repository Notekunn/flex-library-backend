import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class UpdateOrderDetailCommand extends Command<UpdateOrderDetailDto> {
  constructor(public readonly id: number, public readonly dto: UpdateOrderDetailDto) {
    super();
  }
}

@CommandHandler(UpdateOrderDetailCommand)
export class UpdateOrderDetailCommandHandler implements ICommandHandler<UpdateOrderDetailCommand> {
  constructor(@InjectRepository(OrderDetailEntity) private readonly orderDetailRepository: OrderDetailRepository) {}
  async execute(command: UpdateOrderDetailCommand) {
    const { id, dto } = command;
    const orderDetail = await this.orderDetailRepository.findOne({ where: { id } });
    if (!orderDetail) {
      throw new NotFoundException('OrderDetail not found');
    }

    const updatedOrderDetail = await this.orderDetailRepository.save({ ...orderDetail, ...dto });
    return updatedOrderDetail;
  }
}
