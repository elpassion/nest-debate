import { IPinReservation, PinAlreadyReserved } from '../services/pin_generator';

type PinReservationSetup = () => Promise<IPinReservation>;
const itConformsToPinReservationSpecification = ( pinReservationSetup: PinReservationSetup ) => {
  let pinReservation: IPinReservation;

  beforeEach(async () => {
    pinReservation = await pinReservationSetup();
  });

  it('throws error if pin already reserverd', async () => {
    await pinReservation.reservePin('12345');
    await expect(pinReservation.reservePin('12345')).rejects.toThrowError(PinAlreadyReserved);
  });
};

export default itConformsToPinReservationSpecification;