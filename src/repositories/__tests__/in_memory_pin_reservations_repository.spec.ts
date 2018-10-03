import itConformsToPinReservationSpecification from '../../domain/debates/__tests__/pin_reservation_specification';
import InMemoryPinReservationsRepository from '../in_memory_pin_reservations_repository';

describe('InMemoryPinReservationsRepository', () => {
  itConformsToPinReservationSpecification(async () => new InMemoryPinReservationsRepository());
});