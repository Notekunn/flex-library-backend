import { CreateCategoryCommandHandler } from './create-category.command';
import { DeleteCategoryCommandHandler } from './delete-category.command';
import { UpdateCategoryCommandHandler } from './update-category.command';

export const CategoryCommandHandlers = [
  CreateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  UpdateCategoryCommandHandler,
];
