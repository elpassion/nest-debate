import * as uuid from 'uuid';
import Vote, { VoteId } from '../domain/debates/vote';
import IVotesRepository from '../domain/debates/votes_repository';

export default class InMemoryVotesRepository implements IVotesRepository {
  private _votes = new Map<string, Vote>();

  nextId(): Promise<VoteId> {
    const voteId = new VoteId(uuid.v4());
    return Promise.resolve(voteId);
  }

  save(vote: Vote): Promise<void> {
    this._votes.set(vote.id.id, vote);
    return Promise.resolve();
  }

  get(voteId: VoteId): Promise<Vote> {
    const vote = this._votes.get(voteId.id);
    return Promise.resolve(vote || null);
  }
}
