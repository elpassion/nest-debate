import InMemoryDebatesRepository from './in_memory_debates_repository';
import itConformsToDebateRepositorySpecification from '../domain/debates/__tests__/debates_repository_specification';
import itConformsToPinReservationSpecification from '../domain/debates/__tests__/pin_reservation_specification';

describe('InMemoryDebatesRepository', () => {
  itConformsToDebateRepositorySpecification(async () => new InMemoryDebatesRepository());
  itConformsToPinReservationSpecification(async () => new InMemoryDebatesRepository());
});