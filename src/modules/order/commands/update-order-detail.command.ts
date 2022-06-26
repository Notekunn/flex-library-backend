import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { GetOneOrderDetailQuery } from '../queries/get-one-order-detail.query';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class UpdateOrderDetailCommand extends Command<UpdateOrderDetailDto> {
  constructor(public readonly id: number, public readonly dto: UpdateOrderDetailDto) {
    super();
  }
}

@CommandHandler(UpdateOrderDetailCommand)
export class UpdateOrderDetailCommandHandler implements ICommandHandler<UpdateOrderDetailCommand> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: UpdateOrderDetailCommand) {
    const { id, dto } = command;
    const orderDetail = await this.queryBus.execute(new GetOneOrderDetailQuery(id));

    if (!orderDetail) {
      throw new NotFoundException(this.i18n.t('exception.orderNotFound'));
    }

    const updatedOrderDetail = await this.orderDetailRepository.save({ ...orderDetail, ...dto });
    return updatedOrderDetail;
  }
}
