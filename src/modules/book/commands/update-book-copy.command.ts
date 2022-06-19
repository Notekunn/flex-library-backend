import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

export class UpdateBookCopyCommand extends Command<string> {
  constructor(public readonly bookCopyId: number) {
    super();
  }
}

@CommandHandler(UpdateBookCopyCommand)
export class UpdateBookCopyCommandHandler implements ICommandHandler<UpdateBookCopyCommand> {
  constructor() {
    //
  }
  async execute(command: UpdateBookCopyCommand): Promise<any> {
    //
  }
}
