import { IValueObject } from '../value_object';
import { DebateId } from './debate';

export enum AnswerType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL  = 'NEUTRAL',
}

export default class Answer implements IValueObject {
  static createPositive(debateId: DebateId, answer: string): Answer {
    return new Answer(debateId, AnswerType.POSITIVE, answer);
  }

  static createNegative(debateId: DebateId, answer: string): Answer {
    return new Answer(debateId, AnswerType.NEGATIVE, answer);
  }

  static createNeutral(debateId: DebateId, answer: string): Answer {
    return new Answer(debateId, AnswerType.NEUTRAL, answer);
  }

  constructor(readonly debateId: DebateId, readonly answerType: AnswerType, private readonly _answer: string) {}

  public equals(other: any): boolean {
    return (other instanceof Answer)
             && this.debateId.equals(other.debateId)
             && this.answerType === other.answerType
             && this._answer === other._answer;
  }

  public toString(): string {
    return this._answer;
  }
}
