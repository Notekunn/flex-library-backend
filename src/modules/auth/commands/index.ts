import { CreateTokenCommandHandler } from './create-token.command';
import { LoginWithEmailCommandHandler } from './verify-login.command';

export const AuthCommandHandler = [LoginWithEmailCommandHandler, CreateTokenCommandHandler];
