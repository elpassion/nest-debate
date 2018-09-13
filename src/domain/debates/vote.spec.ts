import * as uuid from 'uuid';
import { DebateId } from './debate';
import AggregateId from '../aggregate_id';
import { AnswerType } from './answer';

class VoteId extends AggregateId {
  public equals(other: any): boolean {
    return other instanceof VoteId && this.id === other.id;
  }
}

class Vote {
  constructor(readonly id: VoteId, readonly debateId: DebateId, private _answerType: AnswerType) {}

  public changeToNegative(): void {
    this._answerType = AnswerType.NEGATIVE;
  }

  public changeToNeutral(): void {
    this._answerType = AnswerType.NEUTRAL;
  }

  public changeToPositive(): void {
    this._answerType = AnswerType.POSITIVE;
  }

  public get isPositive(): boolean { return this._answerType === AnswerType.POSITIVE; }
  public get isNegative(): boolean { return this._answerType === AnswerType.NEGATIVE; }
  public get isNeutral(): boolean { return this._answerType === AnswerType.NEUTRAL; }
}

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