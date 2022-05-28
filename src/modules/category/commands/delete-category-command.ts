import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
export class DeleteCategoryCommand extends Command<number> {
  constructor(public readonly id: number) {
    super();
  }
}
@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: CategoryRepository) {}
  async execute(command: DeleteCategoryCommand) {
    const { id } = command;
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.remove(category);
  }
}
