import AggregateId from '../aggregate_id';

export class DebateId extends AggregateId {
  public equals(other: any): boolean {
    return other instanceof DebateId && this.id === other.id;
  }
}

export default class Debate {
  private _positiveAnswer: string;
  private _negativeAnswer: string;
  private _neutralAnswer: string;

  constructor(private _id: DebateId, private _question: string, private _ownerId: string) {
  }

  public updateQuestion(newQuestion: string): void {
    this._question = newQuestion;
  }

  public setPositiveAnswer(answer: string) {
    this._positiveAnswer = answer;
  }

  public setNegativeAnswer(answer: string) {
    this._negativeAnswer = answer;
  }

  public setNeutralAnswer(answer: string) {
    this._neutralAnswer = answer;
  }

  public get question(): string { return this._question; }
  public get ownerId(): string { return this._ownerId; }
  public get positiveAnswer(): string { return this._positiveAnswer; }
  public get negativeAnswer(): string { return this._negativeAnswer; }
  public get neutralAnswer(): string { return this._neutralAnswer; }
}