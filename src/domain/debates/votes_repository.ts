import Vote, { VoteId } from './vote';

export default interface IVotesRepository {
  nextId(): Promise<VoteId>;
  save(vote: Vote): Promise<void>;
  get(voteId: VoteId): Promise<Vote>;
}
