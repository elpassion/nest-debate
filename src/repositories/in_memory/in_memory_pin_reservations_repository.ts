import { PinAlreadyReserved, IPinReservation } from '../../domain/debates/services/pin_generator';

export default class InMemoryPinReservationsRepository implements IPinReservation {
  private _reservedPins: Array<string> = [];

  public async reservePin(pin: string): Promise<void> {
    if (!!this._reservedPins.find(reservedPin => reservedPin === pin)) { throw new PinAlreadyReserved(); }

    this._reservedPins.push(pin);
  }
}