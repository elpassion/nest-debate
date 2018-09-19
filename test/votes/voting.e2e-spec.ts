import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import IDebatesRepository from '../../src/domain/debates/debates_repository';
import Debate, { DebateId } from '../../src/domain/debates/debate';
import { VoteId } from '../../src/domain/debates/vote';
import IVotesRepository from '../../src/domain/debates/votes_repository';

describe('Voting (e2e)', () => {
  let app: INestApplication;
  let debatesRepository: IDebatesRepository;
  let votesRepository: IVotesRepository;
  let debateId: DebateId;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    debatesRepository = moduleFixture.get<IDebatesRepository>('IDebatesRepository');
    votesRepository = moduleFixture.get<IVotesRepository>('IVotesRepository');

    debateId = await debatesRepository.nextId();
    const debate = new Debate(debateId, 'question');
    debate.setPositiveAnswer('Positive Answer');
    debate.setNegativeAnswer('Negative Answer');
    debate.setNeutralAnswer('Neutral Answer');
    debate.publish();
    await debatesRepository.save(debate);

    await app.init();
  });

  it('/debates/:debateId/votes', async () => {
    const response = await request(app.getHttpServer())
      .post(`/debates/${debateId.toString()}/votes`)
      .send({ voteType: 'POSITIVE'});

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      debateId: debateId.toString(),
      voteType: 'POSITIVE',
    });
  });

  describe('when already voted', () => {
    let voteId: VoteId;

    beforeAll(async () => {
      voteId = await votesRepository.nextId();
      const debate = await debatesRepository.get(debateId);
      const vote = debate.votePositive(voteId);
      await votesRepository.save(vote);
    });

    it('PUT /debates/:debateId/votes/:voteId', async () => {
      const response = await request(app.getHttpServer())
        .put(`/debates/${debateId.toString()}/votes/${voteId.toString()}`)
        .send({ voteType: 'NEGATIVE' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: voteId.toString(),
        debateId: debateId.toString(),
        voteType: 'NEGATIVE',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});