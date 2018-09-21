import AggregateId from '../aggregate_id';
import Answer, { AnswerType } from './answer';
import DateProvider from '../support/date_provider';
import Vote, { VoteId } from './vote';
import Publication from './publication';

export class DebateId extends AggregateId {
  public equals(other: any): boolean {
    return other instanceof DebateId && this.id === other.id;
  }
}

export class AnswersMissing extends Error {}
export class VotingNotPossibleError extends Error {}

export default class Debate {
  private _positiveAnswer: Answer = null;
  private _negativeAnswer: Answer = null;
  private _neutralAnswer: Answer = null;
  private _publication: Publication = new Publication();

  constructor(readonly id: DebateId, private _question: string) {
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

  public schedulePublicationAt(date: Date): void {
    if (!this.allAnswersSet()) { throw new AnswersMissing('some answers are missing'); }

    this._publication = this._publication.startAt(date);
  }

  public publish(): void {
    this.schedulePublicationAt(DateProvider.getCurrentDate());
  }

  public scheduleClosingAt(date: Date): void {
    this._publication = this._publication.finishAt(date);
  }

  public close(): void {
    this.scheduleClosingAt(DateProvider.getCurrentDate());
  }

  public votePositive(voteId: VoteId): Vote {
    return this.voteFor(voteId, this._positiveAnswer);
  }

  public voteNegative(voteId: VoteId): Vote {
    return this.voteFor(voteId, this._negativeAnswer);
  }

  public voteNeutral(voteId: VoteId): Vote {
    return this.voteFor(voteId, this._neutralAnswer);
  }

  public get question(): string { return this._question; }
  public get positiveAnswer(): Answer { return this._positiveAnswer; }
  public get negativeAnswer(): Answer { return this._negativeAnswer; }
  public get neutralAnswer(): Answer { return this._neutralAnswer; }
  public get isPublished(): boolean {
    return this._publication.lastsAt(DateProvider.getCurrentDate());
  }

  private allAnswersSet(): boolean {
    return [
      this._positiveAnswer,
      this._negativeAnswer,
      this._neutralAnswer,
    ].every((answer) => answer != null);
  }

  private voteFor(voteId: VoteId, answer: Answer): Vote {
    if (!this.isPublished) { throw new VotingNotPossibleError('debate is not published'); }

    return Vote.for(voteId, answer);
  }
}