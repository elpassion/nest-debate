import IDebatesRepository from '../domain/debates/debates_repository';
import IVotesRepository from '../domain/debates/votes_repository';
import InMemoryDebatesRepository from '../repositories/in_memory_debates_repository';
import InMemoryVotesRepository from '../repositories/in_memory_votes_repository';
import Vote, { VoteId } from '../domain/debates/vote';
import Debate, { DebateId } from '../domain/debates/debate';
import VotingService, { IVotingService, VoteType } from './voting.service';
import PinGenerator from '../domain/debates/services/pin_generator';
import DebatesFactory from '../domain/debates/factories/debates_factory';

describe('VotingService', () => {
  let debatesRepository: IDebatesRepository;
  let votesRepository: IVotesRepository;
  let service: IVotingService;

  let debateId: DebateId;

  beforeEach(async () => {
    debatesRepository = new InMemoryDebatesRepository();
    votesRepository = new InMemoryVotesRepository();
    service = new VotingService(debatesRepository, votesRepository);

    const debatesFactory = new DebatesFactory(debatesRepository, new PinGenerator(debatesRepository));

    const debate = await debatesFactory.createPublished('Question', 'Yes', 'No', 'Maybe');
    await debatesRepository.save(debate);
    debateId = await debate.id;
  });

  describe('create vote', () => {
    it('creates new vote', async () => {
      const vote = await service.createVote(debateId, VoteType.POSITIVE);

      expect(vote).toBeDefined();
      expect(vote.isPositive).toBe(true);
      expect(vote.debateId.equals(debateId)).toBe(true);
    });

    describe.each([VoteType.POSITIVE, VoteType.NEGATIVE, VoteType.NEUTRAL])('create %s vote', (voteType) => {
      it('persists new vote', async () => {
        const vote = await service.createVote(debateId, voteType);
        const persisted = await votesRepository.get(vote.id);

        expect(persisted).not.toBeNull();
      });
    });
  });

  describe('updating vote', () => {
    let voteId: VoteId;

    beforeEach(async () => {
      const vote = await service.createVote(debateId, VoteType.POSITIVE);
      voteId = vote.id;
    });

    it('updates vote', async () => {
      let vote: Vote;

      vote = await service.changeVote(debateId, voteId, VoteType.NEGATIVE);
      expect(vote.isNegative).toBe(true);
      expect(vote.debateId.equals(debateId)).toBe(true);

      vote = await service.changeVote(debateId, voteId, VoteType.POSITIVE);
      expect(vote.isPositive).toBe(true);
      expect(vote.debateId.equals(debateId)).toBe(true);

      vote = await service.changeVote(debateId, voteId, VoteType.NEUTRAL);
      expect(vote.isNeutral).toBe(true);
      expect(vote.debateId.equals(debateId)).toBe(true);
    });

    it('persists updated vote', async () => {
      const vote = await service.changeVote(debateId, voteId, VoteType.NEGATIVE);
      const persisted = await votesRepository.get(vote.id);

      expect(persisted).not.toBeNull();
      expect(persisted.isNegative).toBe(true);
    });
  });
});