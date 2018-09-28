import DebatesFactory from './factories/debates_factory';
import Debate, { VotingNotPossibleError } from './debate';
import IDebatesRepository from './debates_repository';
import PinGenerator, { IPinGenerator } from './services/pin_generator';
import InMemoryDebatesRepository from '../../repositories/in_memory_debates_repository';
import IVotesRepository from './votes_repository';
import InMemoryVotesRepository from '../../repositories/in_memory_votes_repository';
import Vote, { VoteId } from './vote';

describe('Debate', () => {
  let debatesRepository: IDebatesRepository;
  let votesRepository: IVotesRepository;
  let pinGenerator: IPinGenerator;
  let debatesFactory: DebatesFactory;
  let debate: Debate;
  let newVoteId: VoteId;

  describe('Voting', () => {
    beforeEach(async () => {
      debatesRepository = new InMemoryDebatesRepository();
      votesRepository = new InMemoryVotesRepository();
      pinGenerator = new PinGenerator(debatesRepository);
      debatesFactory = new DebatesFactory(debatesRepository, pinGenerator);

      newVoteId = await votesRepository.nextId();
    });

    describe('when debate is published', () => {
      beforeEach(async () => {
        debate = await debatesFactory.createPublished('Question', 'Yes', 'No', 'Maybe');
      });

      it('allows voting for positive answer', () => {
        const vote: Vote = debate.votePositive(newVoteId);

        expect(vote.isPositive).toBe(true);
      });

      it('allows voting for positive answer', () => {
        const vote: Vote = debate.voteNegative(newVoteId);

        expect(vote.isNegative).toBe(true);
      });

      it('allows voting for neutral answer', () => {
        const vote: Vote = debate.voteNeutral(newVoteId);

        expect(vote.isNeutral).toBe(true);
      });
    });

    describe('when debate is not published', () => {
      beforeEach(async () => {
        debate = await debatesFactory.create('Question', 'Yes', 'No', 'Maybe');
      });

      it('does not allow voting', () => {
        expect(() => { debate.votePositive(newVoteId); }).toThrowError(VotingNotPossibleError);
        expect(() => { debate.voteNegative(newVoteId); }).toThrowError(VotingNotPossibleError);
        expect(() => { debate.voteNeutral(newVoteId); }).toThrowError(VotingNotPossibleError);
      });
    });
  });
});