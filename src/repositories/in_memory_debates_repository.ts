import * as uuid from 'uuid';

import IDebatesRepository from '../domain/debates/debates_repository';
import Debate, { DebateId } from '../domain/debates/debate';

export default class InMemoryDebatesRepository implements IDebatesRepository {
  private _debates = new Map<DebateId, Debate>();

  public nextId(): Promise<DebateId> {
    const debateId = new DebateId(uuid.v4());
    return Promise.resolve(debateId);
  }

  public get(debateId: DebateId): Promise<Debate> {
    const debate = this._debates.get(debateId);
    return Promise.resolve(debate || null);
  }

  public save(debate: Debate): Promise<void> {
    this._debates.set(debate.id, debate);
    return Promise.resolve();
  }

  public all(): Promise<Debate[]> {
    const debates = this._debates.values();
    return Promise.resolve(Array.from(debates));
  }

  public delete(debate: Debate): Promise<void> {
    this._debates.delete(debate.id);
    return Promise.resolve();
  }
}