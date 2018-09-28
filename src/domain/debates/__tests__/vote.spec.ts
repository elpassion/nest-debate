import * as uuid from 'uuid';
import { DebateId } from '../debate';
import Answer from '../answer';
import Vote, { VoteId, CantChangeVoteDebateError } from '../vote';

describe('Vote', () => {
  let debateId: DebateId;
  let voteId: VoteId;
  let positiveAnswer: Answer;
  let vote: Vote;

  beforeEach(() => {
    debateId = new DebateId(uuid.v4());
    voteId = new VoteId(uuid.v4());
    positiveAnswer = Answer.createPositive(debateId, 'positive answer');
    vote = Vote.for(voteId, positiveAnswer);
  });

  it('is positive', () => {
    expect(vote.isPositive).toBe(true);
  });

  it('can be changed to negative', () => {
    const newAnswer = Answer.createNegative(debateId, 'negative answer');

    vote.changeAnswerTo(newAnswer);

    expect(vote.isPositive).toBe(false);
    expect(vote.isNegative).toBe(true);
  });

  it('can be changed to neutral', () => {
    const newAnswer = Answer.createNeutral(debateId, 'neutral answer');

    vote.changeAnswerTo(newAnswer);

    expect(vote.isPositive).toBe(false);
    expect(vote.isNeutral).toBe(true);
  });

  it('can be changed to positive', () => {
    const neutralAnswer = Answer.createNeutral(debateId, 'neural answer');

    vote.changeAnswerTo(neutralAnswer);
    vote.changeAnswerTo(positiveAnswer);

    expect(vote.isPositive).toBe(true);
  });

  // tslint:disable-next-line:quotemark
  it("can't be changed to different debates answer", () => {
    const newDebateId = new DebateId(uuid.v4());
    const newAnswer = Answer.createNegative(newDebateId, 'negative answer');

    expect(() => { vote.changeAnswerTo(newAnswer); }).toThrowError(CantChangeVoteDebateError);
  });
});