import * as uuid from 'uuid';

import IDebatesRepository from '../domain/debates/debates_repository';
import Debate, { DebateId } from '../domain/debates/debate';
import { PinAlreadyReserved } from '../domain/debates/services/pin_generator';

export default class InMemoryDebatesRepository implements IDebatesRepository {
  private _debates = new Map<string, Debate>();
  private _reservedPins: Array<string> = [];

  public nextId(): Promise<DebateId> {
    const debateId = new DebateId(uuid.v4());
    return Promise.resolve(debateId);
  }

  public get(debateId: DebateId): Promise<Debate> {
    const debate = this._debates.get(debateId.toString());
    return Promise.resolve(debate || null);
  }

  public save(debate: Debate): Promise<void> {
    this._debates.set(debate.id.toString(), debate);
    return Promise.resolve();
  }

  public all(): Promise<Debate[]> {
    const debates = this._debates.values();
    return Promise.resolve(Array.from(debates));
  }

  public delete(debate: Debate): Promise<void> {
    this._debates.delete(debate.id.toString());
    return Promise.resolve();
  }

  public async reservePin(pin: string): Promise<void> {
    if (!!this._reservedPins.find(reservedPin => reservedPin === pin)) { throw new PinAlreadyReserved(); }

    this._reservedPins.push(pin);
  }
}

export const provider = {
  provide: 'IDebatesRepository',
  useValue: new InMemoryDebatesRepository(),
};