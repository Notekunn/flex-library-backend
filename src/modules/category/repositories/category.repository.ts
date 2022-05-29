import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryRepository extends Repository<CategoryEntity> {}
