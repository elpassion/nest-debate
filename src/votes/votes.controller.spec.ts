import { VotesController } from './votes.controller';
import InMemoryDebatesRepository from '../repositories/in_memory_debates_repository';
import IDebatesRepository from '../domain/debates/debates_repository';
import IVotesRepository from '../domain/debates/votes_repository';
import InMemoryVotesRepository from '../repositories/in_memory_votes_repository';
import Debate, { DebateId } from '../domain/debates/debate';
import { VoteId } from '../domain/debates/vote';
import VotingService, { IVotingService } from '../services/voting.service';

describe('Votes Controller', () => {
  let debatesRepository: IDebatesRepository;
  let votesRepository: IVotesRepository;
  let votingService: IVotingService;
  let controller: VotesController;
  let debateId: DebateId;

  beforeEach(async () => {
    debatesRepository = new InMemoryDebatesRepository();
    votesRepository = new InMemoryVotesRepository();

    debateId = await debatesRepository.nextId();
    const debate = new Debate(debateId, 'question');
    debate.setPositiveAnswer('Positive Answer');
    debate.setNegativeAnswer('Negative Answer');
    debate.setNeutralAnswer('Neutral Answer');
    debate.publish();
    await debatesRepository.save(debate);

    votingService = new VotingService(debatesRepository, votesRepository);
    controller = new VotesController(votingService);
  });

  describe('create', () => {
    it('should return new vote', async () => {
      expect(await controller.create(debateId, 'POSITIVE')).toMatchObject({
        id: expect.any(String),
        voteType: 'POSITIVE',
        debateId: debateId.toString(),
      });
    });

    it('should persist new vote', async () => {
      const { id } = await controller.create(debateId, 'NEGATIVE');
      const persistedVote = await votesRepository.get(new VoteId(id));

      expect(persistedVote).not.toBeNull();
    });
  });

  describe('update', async () => {
    let voteId: VoteId;

    beforeEach(async () => {
      const debate = await debatesRepository.get(debateId);
      voteId = await votesRepository.nextId();

      const vote = debate.votePositive(voteId);
      await votesRepository.save(vote);
    });

    it('should return updated vote', async () => {
      expect(await controller.update(debateId, voteId, 'NEGATIVE')).toMatchObject({
        id: voteId.toString(),
        voteType: 'NEGATIVE',
        debateId: debateId.toString(),
      });
    });
  });
});
