import InMemoryDebatesRepository from './in_memory_debates_repository';
import InMemoryVotesRepository from './in_memory_votes_repository';
import InMemoryPinReservationsRepository from './in_memory_pin_reservations_repository';

export const repositoriesProviders = [
  {
    provide: 'IDebatesRepository',
    useValue: new InMemoryDebatesRepository(),
  },
  {
    provide: 'IVotesRepository',
    useValue: new InMemoryVotesRepository(),
  },
  {
    provide: 'IPinReservation',
    useValue: new InMemoryPinReservationsRepository(),
  },
];