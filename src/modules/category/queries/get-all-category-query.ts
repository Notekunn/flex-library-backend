import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

export class GetAllCategoryQuery extends Query<CategoryEntity[]> {
  constructor(public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllCategoryQuery)
export class GetAllCategoryQueryHandler implements IQueryHandler<GetAllCategoryQuery, CategoryEntity[]> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async execute(query: GetAllCategoryQuery) {
    const { dto } = query;
    const categories = await this.categoryRepository.find({ ...dto });
    return categories;
  }
}
