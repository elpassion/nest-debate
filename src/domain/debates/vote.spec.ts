import * as uuid from 'uuid';
import { DebateId } from './debate';
import { AnswerType } from './answer';
import Vote, { VoteId } from './vote';

describe('Vote', () => {
  let debateId: DebateId;
  let voteId: VoteId;
  let vote: Vote;

  beforeEach(() => {
    debateId = new DebateId(uuid.v4());
    voteId = new VoteId(uuid.v4());
    vote = new Vote(voteId, debateId, AnswerType.POSITIVE);
  });

  it('is positive', () => {
    expect(vote.isPositive).toBe(true);
  });

  it('can be changed to negative', () => {
    vote.changeToNegative();

    expect(vote.isPositive).toBe(false);
    expect(vote.isNegative).toBe(true);
  });

  it('can be changed to neutral', () => {
    vote.changeToNeutral();

    expect(vote.isPositive).toBe(false);
    expect(vote.isNeutral).toBe(true);
  });

  it('can be changed to positive', () => {
    vote.changeToNeutral();
    vote.changeToPositive();

    expect(vote.isPositive).toBe(true);
  });
});