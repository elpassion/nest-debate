import * as uuid from 'uuid';
import Vote, { VoteId } from '../../../domain/debates/vote';
import Answer from '../../../domain/debates/answer';
import IDebatesRepository from '../../../domain/debates/debates_repository';
import InMemoryDebatesRepository from '../in_memory_debates_repository';
import InMemoryVotesRepository from '../in_memory_votes_repository';
import IVotesRepository from '../../../domain/debates/votes_repository';

describe('VotesRepository', () => {
  let votesRepository: IVotesRepository;
  let debatesRepository: IDebatesRepository;

  beforeEach(() => {
    votesRepository = new InMemoryVotesRepository();
    debatesRepository = new InMemoryDebatesRepository();
  });

  it('returns next id', async () => {
    const [voteId, secondVoteId] = await Promise.all([votesRepository.nextId(), votesRepository.nextId()]);

    expect(voteId.equals(secondVoteId)).toBe(false);
  });

  it('saves vote', async () => {
    const voteId = await votesRepository.nextId();
    const debateId = await debatesRepository.nextId();
    const answer = Answer.createPositive(debateId, 'positive answer');
    const vote = Vote.for(voteId, answer);

    await votesRepository.save(vote);
    const persistedVote = await votesRepository.get(voteId);

    expect(vote.id.equals(persistedVote.id)).toBe(true);
  });

  it('returns null when no element found', async () => {
    const voteId = new VoteId(uuid.v4());
    const vote = await votesRepository.get(voteId);

    expect(vote).toBeNull();
  });
});