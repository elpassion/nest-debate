import { IValueObject } from '../value_object';
import { DebateId } from './debate';

export enum AnswerType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL  = 'NEUTRAL',
}

export default class Answer implements IValueObject {
  constructor(readonly debateId: DebateId, readonly answerType: AnswerType, readonly answer: string) {}

  public equals(other: any): boolean {
    return (other instanceof Answer)
             && this.debateId.equals(other.debateId)
             && this.answerType === other.answerType
             && this.answer === other.answer;
  }
}
