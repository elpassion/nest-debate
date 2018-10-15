import { createConnection } from 'typeorm';
import DebateSnapshot from './repositories/sql/debate_snapshot.etity';
import { ConfigService } from './config.module';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (configService: ConfigService) => await createConnection({
      type: 'postgres',
      url: configService.databaseUrl,
      synchronize: configService.databaseSynchronize,
      entities: [DebateSnapshot],
    }),
    inject: [ConfigService],
  },
];