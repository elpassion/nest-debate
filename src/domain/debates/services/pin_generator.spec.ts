interface IPinReservation {
  reservePin(pin: string): void;
}

interface IPinGenerator {
  getRandomPin(): string;
}

class PinCannotBeGenerated extends Error {}

class PinGenerator implements IPinGenerator {
  constructor(private readonly _pinReservation: IPinReservation, private readonly _numRetries: number = 3) {}

  getRandomPin(): string {
    let pin: string;
    let approach   = 1;

    while (approach <= this._numRetries) {
      try {
        const possiblePin = Array.from({length: 5}, () => this.generateRandomDigit()).join('');
        this._pinReservation.reservePin(possiblePin);
        pin = possiblePin;
        break;
      }
      catch (err) {
        if (!(err instanceof PinAlreadyReserved)) { throw err; }
      }
      approach += 1;
    }

    if (!!pin) { return pin; }
    else { throw new PinCannotBeGenerated(); }
  }

  private generateRandomDigit(): number {
    return Math.floor(Math.random() * 9);
  }
}

class PinAlreadyReserved extends Error {}

class FailingPinReservation implements IPinReservation {
  private _numTries = 0;

  constructor(private readonly _failTries: number) {}

  reservePin(pin: string): void {
    this._numTries += 1;
    if (this._numTries <= this._failTries) { throw new PinAlreadyReserved(); }
  }
}

describe('PinGenerator', () => {
  let pinReservation: IPinReservation;
  let pinGenerator: IPinGenerator;

  it('generates 5 digits pin', () => {
    pinReservation = new FailingPinReservation(0);
    pinGenerator = new PinGenerator(pinReservation, 2);

    expect(pinGenerator.getRandomPin()).toMatch(/^\d{5}$/);
  });

  describe('when pin already reserved ', () => {
    const failures = 1;

    beforeEach(() => {
      pinReservation = new FailingPinReservation(failures);
    });

    it('generates next pin', () => {
      pinGenerator = new PinGenerator(pinReservation);

      expect(pinGenerator.getRandomPin()).toMatch(/^\d{5}$/);
    });

    it('fails after provided number of retries', () => {
      pinGenerator = new PinGenerator(pinReservation, 1);

      expect(() => pinGenerator.getRandomPin()).toThrowError(PinCannotBeGenerated);
    });

    it('does not try to reserve pin more times than needed', () => {
      jest.spyOn(pinReservation, 'reservePin');
      pinGenerator = new PinGenerator(pinReservation, 5);

      pinGenerator.getRandomPin();

      expect(pinReservation.reservePin).toHaveBeenCalledTimes(failures + 1);
    });
  });
});