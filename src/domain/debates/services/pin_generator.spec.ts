import PinGenerator, { IPinReservation, PinAlreadyReserved, IPinGenerator, PinCannotBeGenerated } from './pin_generator';

class FailingPinReservation implements IPinReservation {
  private _numTries = 0;

  constructor(private readonly _failTries: number) {}

  async reservePin(pin: string): Promise<void> {
    this._numTries += 1;
    if (this._numTries <= this._failTries) { throw new PinAlreadyReserved(); }
  }
}

describe('PinGenerator', () => {
  let pinReservation: IPinReservation;
  let pinGenerator: IPinGenerator;

  it('generates 5 digits pin', async () => {
    pinReservation = new FailingPinReservation(0);
    pinGenerator = new PinGenerator(pinReservation, 2);

    expect(await pinGenerator.getRandomPin()).toMatch(/^\d{5}$/);
  });

  describe('when pin already reserved ', () => {
    const failures = 1;

    beforeEach(() => {
      pinReservation = new FailingPinReservation(failures);
    });

    it('generates next pin', async () => {
      pinGenerator = new PinGenerator(pinReservation);

      expect(await pinGenerator.getRandomPin()).toMatch(/^\d{5}$/);
    });

    it('fails after provided number of retries', async () => {
      pinGenerator = new PinGenerator(pinReservation, 1);

      await expect(pinGenerator.getRandomPin()).rejects.toThrowError(PinCannotBeGenerated);
    });

    it('does not try to reserve pin more times than needed', async () => {
      jest.spyOn(pinReservation, 'reservePin');
      pinGenerator = new PinGenerator(pinReservation, 5);

      await pinGenerator.getRandomPin();

      expect(pinReservation.reservePin).toHaveBeenCalledTimes(failures + 1);
    });
  });
});