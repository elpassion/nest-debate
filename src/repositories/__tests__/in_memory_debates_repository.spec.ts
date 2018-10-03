import InMemoryDebatesRepository from '../in_memory_debates_repository';
import itConformsToDebateRepositorySpecification from '../../domain/debates/__tests__/debates_repository_specification';

describe('InMemoryDebatesRepository', () => {
  itConformsToDebateRepositorySpecification(async () => new InMemoryDebatesRepository());
});