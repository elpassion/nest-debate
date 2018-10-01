import { IValueObject } from '../value_object';

export class StartIsNotBeforeFinish extends Error {}

export interface IPublicationSnapshot {
  startDate: Date|null;
  finishDate: Date|null;
}

export default class Publication implements IValueObject {
  constructor(protected readonly startDate?: Date, protected readonly finishDate?: Date) {
    this.checkThatStartIsBeforeFinish();
  }

  public lastsAt(date: Date): boolean {
    return this.startedBefore(date) && !this.isFinishedBefore(date);
  }

  public startAt(startAtDate: Date): Publication {
    return new Publication(startAtDate, this.finishDate);
  }

  public finishAt(finishAtDate: Date): Publication {
    return new Publication(this.startDate, finishAtDate);
  }

  public equals(other: any): boolean {
    return (other instanceof Publication)
      && this.startDate.getTime() === other.startDate.getTime()
      && this.finishDate.getTime() === other.finishDate.getTime();
  }

  public get snapshot(): IPublicationSnapshot {
    return {
      startDate: this.startDate || null,
      finishDate: this.finishDate || null,
    };
  }

  private startedBefore(date: Date): boolean {
    return !!this.startDate && this.startDate <= date;
  }

  private isFinishedBefore(date: Date): boolean {
    return !!this.finishDate && this.finishDate <= date;
  }

  private checkThatStartIsBeforeFinish(): void {
    if (!!this.startDate && !!this.finishDate && this.startDate > this.finishDate) { throw new StartIsNotBeforeFinish(); }
  }
}
