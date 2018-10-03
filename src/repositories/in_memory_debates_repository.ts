import * as uuid from 'uuid';

import IDebatesRepository from '../domain/debates/debates_repository';
import Debate, { DebateId, IDebateSnapshot } from '../domain/debates/debate';
import { PinAlreadyReserved } from '../domain/debates/services/pin_generator';

export default class InMemoryDebatesRepository implements IDebatesRepository {
  private _debates = new Map<string, IDebateSnapshot>();
  private _reservedPins: Array<string> = [];

  public nextId(): Promise<DebateId> {
    const debateId = new DebateId(uuid.v4());
    return Promise.resolve(debateId);
  }

  public get(debateId: DebateId): Promise<Debate> {
    const debateSnapshot = this._debates.get(debateId.toString());
    const debate = (debateSnapshot && Debate.loadFromSnapshot(debateSnapshot)) || null;
    return Promise.resolve(debate);
  }

  public save(debate: Debate): Promise<void> {
    const snapshot = {} as IDebateSnapshot;
    debate.dumpStateToSnapshot(snapshot);
    this._debates.set(debate.id.toString(), snapshot);
    return Promise.resolve();
  }

  public all(): Promise<Debate[]> {
    const debatesSnapshots = Array.from(this._debates.values());
    return Promise.resolve(Array.from(debatesSnapshots.map(Debate.loadFromSnapshot)));
  }

  public delete(debate: Debate): Promise<void> {
    this._debates.delete(debate.id.toString());
    return Promise.resolve();
  }
}

export const provider = {
  provide: 'IDebatesRepository',
  useValue: new InMemoryDebatesRepository(),
};