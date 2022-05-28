import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';

export class CategoryRepository extends Repository<CategoryEntity> {}
