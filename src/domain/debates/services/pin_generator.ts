export interface IPinReservation {
  reservePin(pin: string): Promise<void>;
}

export interface IPinGenerator {
  getRandomPin(): Promise<string>;
}

export class PinCannotBeGenerated extends Error {}
export class PinAlreadyReserved extends Error {}

export default class PinGenerator implements IPinGenerator {
  constructor(private readonly _pinReservation: IPinReservation, private readonly _numRetries: number = 3) {}

  async getRandomPin(): Promise<string> {
    let pin: string;
    let approach   = 1;

    while (approach <= this._numRetries) {
      try {
        const possiblePin = Array.from({length: 5}, () => this.generateRandomDigit()).join('');
        await this._pinReservation.reservePin(possiblePin);
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
