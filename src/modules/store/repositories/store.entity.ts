import { Repository } from 'typeorm';
import { StoreEntity } from '../entities/store.entity';

export class StoreRepository extends Repository<StoreEntity> {}
