import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

export class GetOneCategoryQuery extends Query<CategoryEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}

@QueryHandler(GetOneCategoryQuery)
export class GetOneCategoryQueryHandler implements IQueryHandler<GetOneCategoryQuery, CategoryEntity | null> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async execute(query: GetOneCategoryQuery) {
    const { id } = query;
    const category = await this.categoryRepository.findOne({ where: { id } });
    return category;
  }
}
