import { CreateCategoryCommand } from './create-category.command';
import { DeleteCategoryCommand } from './delete-category.command';
import { UpdateCategoryCommand } from './update-category.command';

export const CategoryCommandHandlers = [CreateCategoryCommand, DeleteCategoryCommand, UpdateCategoryCommand];
