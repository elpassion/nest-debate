import Debate, { DebateId } from './debate';
import { IPinReservation } from './services/pin_generator';

export default interface IDebatesRepository extends IPinReservation {
  nextId(): Promise<DebateId>;
  get(debateId: DebateId): Promise<Debate>;
  save(debate: Debate): Promise<void>;
  all(): Promise<Debate[]>;
  delete(debate: Debate): Promise<void>;
}