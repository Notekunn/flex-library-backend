import { OrderDetailAction } from '@constants/order-detail-action';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

interface NewQuantityResult {
  quantity: number;
  action: 'delete' | 'insert' | 'update' | 'donothing';
}

export class GetNewQuantityCommand extends Command<NewQuantityResult> {
  constructor(
    public readonly quantity: number,
    public readonly action: OrderDetailAction,
    public readonly oldQuantity?: number,
  ) {
    super();
  }
}

@CommandHandler(GetNewQuantityCommand)
export class GetNewQuantityCommandHandler implements ICommandHandler<GetNewQuantityCommand, NewQuantityResult> {
  async execute(command: GetNewQuantityCommand): Promise<NewQuantityResult> {
    const { quantity, oldQuantity, action } = command;
    if (quantity <= 0 || action == OrderDetailAction.REMOVE) {
      return {
        quantity: 0,
        action: action == OrderDetailAction.ADD || action == OrderDetailAction.SUB ? 'donothing' : 'delete',
      };
    }
    let qt = oldQuantity || 0;
    let act: NewQuantityResult['action'];
    switch (action) {
      case OrderDetailAction.ADD:
        qt += quantity;
        act = oldQuantity ? 'update' : 'insert';
        break;
      case OrderDetailAction.SUB:
        qt -= quantity;
        act = oldQuantity ? 'update' : 'insert';
        break;
      case OrderDetailAction.SET:
      default:
        qt = quantity;
        act = qt === oldQuantity ? 'donothing' : 'update';
        break;
    }
    return {
      action: qt > 0 ? act : 'delete',
      quantity: Math.max(qt, 0),
    };
  }
}
