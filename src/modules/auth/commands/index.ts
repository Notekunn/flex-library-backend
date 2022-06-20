import { CreateTokenCommandHandler } from './create-token.command';
import { RegisterByEmailCommandHandler } from './register-by-email.command';
import { LoginWithEmailCommandHandler } from './verify-login.command';

export const AuthCommandHandler = [
  LoginWithEmailCommandHandler,
  CreateTokenCommandHandler,
  RegisterByEmailCommandHandler,
];
