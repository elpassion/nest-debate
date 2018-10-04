import { createConnection } from 'typeorm';
import DebateSnapshot from './repositories/sql/debate_snapshot.etity';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection({
      type: 'postgres',
      url: 'postgresql://localhost:5432/el-debate-ts',
      synchronize: true,
      entities: [DebateSnapshot],
    }),
  },
];