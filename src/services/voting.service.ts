import Debate, { DebateId } from '../domain/debates/debate';
import Vote, { VoteId } from '../domain/debates/vote';
import IDebatesRepository from '../domain/debates/debates_repository';
import IVotesRepository from '../domain/debates/votes_repository';

interface IVotingStrategy {
  create(voteId: VoteId, debate: Debate): Vote;
  change(vote: Vote, debate: Debate): void;
}

const positiveStrategy = new (class implements IVotingStrategy {
  create(voteId: VoteId, debate: Debate): Vote { return debate.votePositive(voteId); }
  change(vote: Vote, debate: Debate): void { vote.changeAnswerTo(debate.positiveAnswer); }
})();

const negativeStrategy = new (class implements IVotingStrategy {
  create(voteId: VoteId, debate: Debate) { return debate.voteNegative(voteId); }
  change(vote: Vote, debate: Debate): void { vote.changeAnswerTo(debate.negativeAnswer); }
})();

const neutralStrategy = new (class implements IVotingStrategy {
  create(voteId: VoteId, debate: Debate) { return debate.voteNeutral(voteId); }
  change(vote: Vote, debate: Debate): void { vote.changeAnswerTo(debate.neutralAnswer); }
})();

export enum VoteType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
}

export interface IVotingService {
  createVote(debateId: DebateId, voteType: VoteType): Promise<Vote>;
  changeVote(debateId: DebateId, voteId: VoteId, voteType: VoteType): Promise<Vote>;
}

export default class VotingService implements IVotingService {
  private static readonly VOTING_STRATEGIES = new Map<VoteType, IVotingStrategy>([
    [VoteType.POSITIVE, positiveStrategy],
    [VoteType.NEGATIVE, negativeStrategy],
    [VoteType.NEUTRAL, neutralStrategy],
  ]);

  constructor(private readonly _debatesRepository: IDebatesRepository, private readonly _votesRepository: IVotesRepository) {}

  public async createVote(debateId: DebateId, voteType: VoteType): Promise<Vote> {
    const debate = await this._debatesRepository.get(debateId);
    const voteId = await this._votesRepository.nextId();

    const vote: Vote = this.getVotingStrategy(voteType).create(voteId, debate);

    await this._votesRepository.save(vote);
    return vote;
  }

  public async changeVote(debateId: DebateId, voteId: VoteId, voteType: VoteType): Promise<Vote> {
    const debate = await this._debatesRepository.get(debateId);
    const vote   = await this._votesRepository.get(voteId);

    this.getVotingStrategy(voteType).change(vote, debate);

    this._votesRepository.save(vote);
    return vote;
  }

  private getVotingStrategy(voteType: VoteType) {
    return VotingService.VOTING_STRATEGIES.get(voteType);
  }
}