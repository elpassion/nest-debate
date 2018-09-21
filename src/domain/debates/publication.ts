export class StartIsNotBeforeFinish extends Error {}

export default class Publication {
  constructor(private readonly _startAt?: Date, private readonly _finishAt?: Date) {
    this.checkThatStartIsBeforeFinish();
  }

  public lastsAt(date: Date): boolean {
    return this.startedBefore(date) && !this.isFinishedBefore(date);
  }

  private startedBefore(date: Date): boolean {
    return !!this._startAt && this._startAt <= date;
  }

  private isFinishedBefore(date: Date): boolean {
    return !!this._finishAt && this._finishAt <= date;
  }

  private checkThatStartIsBeforeFinish(): void {
    if (!!this._startAt && !!this._finishAt && this._startAt > this._finishAt) { throw new StartIsNotBeforeFinish(); }
  }
}
