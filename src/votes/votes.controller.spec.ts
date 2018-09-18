import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import InMemoryDebatesRepository from '../repositories/in_memory_debates_repository';
import IDebatesRepository from '../domain/debates/debates_repository';
import IVotesRepository from '../domain/debates/votes_repository';
import InMemoryVotesRepository from '../repositories/in_memory_votes_repository';
import Debate, { DebateId } from '../domain/debates/debate';
import { identity } from 'rxjs';
import { VoteId } from '../domain/debates/vote';

describe('Votes Controller', () => {
  let debatesRepository: IDebatesRepository;
  let votesRepository: IVotesRepository;
  let controller: VotesController;

  beforeEach(async () => {
    debatesRepository = new InMemoryDebatesRepository();
    votesRepository = new InMemoryVotesRepository();
    controller = new VotesController(debatesRepository, votesRepository);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    let debateId: DebateId;

    beforeEach(async () => {
      debateId = await debatesRepository.nextId();
      const debate = new Debate(debateId, 'question');
      debate.setPositiveAnswer('Positive Answer');
      debate.setNegativeAnswer('Negative Answer');
      debate.setNeutralAnswer('Neutral Answer');
      debate.publish();
      await debatesRepository.save(debate);
    });

    it('should return new vote', async () => {
      expect(await controller.create(debateId, 'POSITIVE')).toMatchObject({
        id: expect.any(String),
        voteType: 'POSITIVE',
        debateId: debateId.id,
      });
    });

    it('should persist new vote', async () => {
      const { id } = await controller.create(debateId, 'NEGATIVE');
      const persistedVote = await votesRepository.get(new VoteId(id));

      expect(persistedVote).not.toBeNull();
    });
  });
});
