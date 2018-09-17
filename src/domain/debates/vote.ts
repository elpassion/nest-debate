import AggregateId from '../aggregate_id';
import { DebateId } from './debate';
import Answer, { AnswerType } from './answer';

export class VoteId extends AggregateId {
  public equals(other: any): boolean {
    return other instanceof VoteId && this.id === other.id;
  }
}

export default class Vote {
  private constructor(readonly id: VoteId, readonly debateId: DebateId, private _answerType: AnswerType) {}

  public static for(voteId: VoteId, answer: Answer): Vote {
    return new Vote(voteId, answer.debateId, answer.answerType);
  }

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
