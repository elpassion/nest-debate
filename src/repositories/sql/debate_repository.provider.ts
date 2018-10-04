import { Connection } from 'typeorm';
import DebatesRepository from './debate_repository';

export const debateRepositoryProviders = [
  {
    provide: 'IDebatesRepository',
    useFactory: async (connection: Connection) => {
      return connection.getCustomRepository(DebatesRepository);
    },
    inject: ['DbConnectionToken'],
  },
];