import { AbstractRepository, EntityRepository } from 'typeorm';
import * as uuid from 'uuid';
import DebateSnapshot from './debate_snapshot.etity';
import IDebatesRepository from '../../domain/debates/debates_repository';
import Debate, { DebateId, IDebateSnapshot } from '../../domain/debates/debate';

@EntityRepository(DebateSnapshot)
export default class DebatesRepository extends AbstractRepository<DebateSnapshot> implements IDebatesRepository {
  public async nextId(): Promise<DebateId> {
    return new DebateId(uuid.v4());
  }

  public async get(debateId: DebateId): Promise<Debate> {
    const snapshot = await this.repository.findOne({ id: debateId.toString() });
    if (!!snapshot) {
      return Debate.loadFromSnapshot(snapshot);
    } else {
      return null;
    }
  }

  public async save(debate: Debate): Promise<void> {
    const snapshot: IDebateSnapshot = new DebateSnapshot();
    debate.dumpStateToSnapshot(snapshot);
    await this.repository.save(snapshot);
  }

  public async all(): Promise<Debate[]> {
    const snapshots = await this.repository.createQueryBuilder().getMany();
    return snapshots.map(Debate.loadFromSnapshot);
  }

  public async delete(debate: Debate): Promise<void> {
    await this.repository.delete({ id: debate.id.toString() });
  }

  reservePin(pin: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async clear(): Promise<void> {
    await this.repository.clear();
  }
}