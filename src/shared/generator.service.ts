import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class GeneratorService {
  public uuid(): string {
    return uuid.v4();
  }

  public fileName(ext: string): string {
    return `${this.uuid()}.${ext}`;
  }
}
