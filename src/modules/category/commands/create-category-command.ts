import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

export class CreateCategoryCommand extends Command<CreateCategoryDto> {
  constructor(public readonly dto: CreateCategoryDto) {
    super();
  }
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: CategoryRepository) {}
  async execute(command: CreateCategoryCommand) {
    const { dto } = command;
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }
}
