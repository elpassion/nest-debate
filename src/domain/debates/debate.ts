import AggregateId from '../aggregate_id';
import Answer, { AnswerType } from './answer';

export class DebateId extends AggregateId {
  public equals(other: any): boolean {
    return other instanceof DebateId && this.id === other.id;
  }
}

export default class Debate {
  private _positiveAnswer: Answer;
  private _negativeAnswer: Answer;
  private _neutralAnswer: Answer;

  constructor(readonly id: DebateId, private _question: string, private _ownerId: string) {
  }

  public updateQuestion(newQuestion: string): void {
    this._question = newQuestion;
  }

  public setPositiveAnswer(answer: string) {
    this._positiveAnswer = Answer.createPositive(this.id, answer);
  }

  public setNegativeAnswer(answer: string) {
    this._negativeAnswer = Answer.createNegative(this.id, answer);
  }

  public setNeutralAnswer(answer: string) {
    this._neutralAnswer = Answer.createNeutral(this.id, answer);
  }

  public get question(): string { return this._question; }
  public get ownerId(): string { return this._ownerId; }
  public get positiveAnswer(): Answer { return this._positiveAnswer; }
  public get negativeAnswer(): Answer { return this._negativeAnswer; }
  public get neutralAnswer(): Answer { return this._neutralAnswer; }
}