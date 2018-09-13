import Debate, { DebateId } from './debate';

export default interface IDebatesRepository {
  nextId(): Promise<DebateId>;
  get(debateId: DebateId): Promise<Debate>;
  save(debate: Debate): Promise<void>;
  all(): Promise<Debate[]>;
  delete(debate: Debate): Promise<void>;
}