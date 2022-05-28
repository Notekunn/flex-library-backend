import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { GetOneCategoryQuery } from '../queries/get-one-category-query';
import { CategoryRepository } from '../repositories/category.repository';

export class UpdateCategoryCommand extends Command<CategoryEntity> {
  constructor(public readonly id: number, public readonly dto: CategoryEntity) {
    super();
  }
}

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: CategoryRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: UpdateCategoryCommand) {
    const { id, dto } = command;
    const category = await this.queryBus.execute(new GetOneCategoryQuery(id));
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const updatedCategory = await this.categoryRepository.save({
      ...category,
      ...dto,
    });
    return updatedCategory;
  }
}
