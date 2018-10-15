import { Test } from '@nestjs/testing';
import itConformsToDebateRepositorySpecification from '../../../domain/debates/__tests__/debates_repository_specification';
import { debateRepositoryProviders } from '../debate_repository.provider';
import { databaseProviders } from '../../../database.providers';
import DebatesRepository from '../debate_repository';
import { Connection } from 'typeorm';
import ConfigModule from '../../../config.module';

describe('Sql DebatesRepository', () => {
  let debatesRepository: DebatesRepository;
  let connection: Connection;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [...databaseProviders, ...debateRepositoryProviders],
    }).compile();

    debatesRepository = module.get<DebatesRepository>('IDebatesRepository');
    connection = module.get<Connection>('DbConnectionToken');
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await debatesRepository.clear();
  });

  itConformsToDebateRepositorySpecification(async () => {
    return debatesRepository;
  });
});