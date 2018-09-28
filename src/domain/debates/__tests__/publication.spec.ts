import Publication, { StartIsNotBeforeFinish } from '../publication';
import DateProvider from '../../support/date_provider';
import DateUtils from '../../support/date_utils';

describe('Publication', () => {
  let now: Date;

  beforeEach(() => { now = new Date(); });

  it('does not last by default', () => {
    const publication = new Publication();
    expect(publication.lastsAt(now)).toBe(false);
  });

  it('lasts from provided time', () => {
    const startAt = DateUtils.moveDate(now, {minutes: -5});
    const publication = new Publication(startAt);

    expect(publication.lastsAt(startAt)).toBe(true);
    expect(publication.lastsAt(new Date())).toBe(true);
  });

  it('lasts until provided finish time', () => {
    const startAt = now;
    const finishAt = DateUtils.moveDate(startAt, {minutes: 5});

    const publication = new Publication(startAt, finishAt);

    expect(publication.lastsAt(finishAt)).toBe(false);
  });

  // tslint:disable-next-line:quotemark
  it("can't be created with start time after end time", () => {
    expect(() => {
      const startAt = DateUtils.moveDate(now, {minutes: 5});
      const finishAt = DateUtils.moveDate(now, {minutes: -5});
      new Publication(startAt, finishAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });

  it('can be started', () => {
    const startAt = DateUtils.moveDate(now, {minutes: -5});
    const publication = new Publication().startAt(startAt);

    expect(publication.lastsAt(startAt)).toBe(true);
    expect(publication.lastsAt(new Date())).toBe(true);
  });

  it('can be finished', () => {
    const startAt = now;
    const finishAt = DateUtils.moveDate(startAt, {minutes: 5});

    const publication = new Publication(startAt).finishAt(finishAt);

    expect(publication.lastsAt(finishAt)).toBe(false);
  });

  // tslint:disable-next-line:quotemark
  it("can't be started after finish", () => {
    const startAt = DateUtils.moveDate(now, {minutes: 5});
    const finishAt = DateUtils.moveDate(now, {minutes: -5});

    const publication = new Publication().finishAt(finishAt);

    expect(() => {
      publication.startAt(startAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });

  // tslint:disable-next-line:quotemark
  it("can't be finished before start", () => {
    const startAt = DateUtils.moveDate(now, {minutes: 5});
    const finishAt = DateUtils.moveDate(now, {minutes: -5});

    const publication = new Publication(startAt);

    expect(() => {
      publication.finishAt(finishAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });

  it('is equal with publication with same dates', () => {
    const startAt = DateUtils.moveDate(now, {minutes: -5});
    const finishAt = DateUtils.moveDate(now, {minutes: 5});
    const firstPublication = new Publication(startAt, finishAt);

    const secondStartAt = DateUtils.moveDate(now, {minutes: -5});
    const secondFinishAt = DateUtils.moveDate(now, {minutes: 5});
    const secondPublication = new Publication(secondStartAt, secondFinishAt);

    expect(firstPublication.equals(secondPublication)).toBe(true);
  });

  it('is not equal when start dates are different', () => {
    const startAt = DateUtils.moveDate(now, {minutes: -5});
    const finishAt = DateUtils.moveDate(now, {minutes: 5});
    const firstPublication = new Publication(startAt, finishAt);

    const secondStartAt = DateUtils.moveDate(now, {minutes: -4});
    const secondFinishAt = DateUtils.moveDate(now, {minutes: 5});
    const secondPublication = new Publication(secondStartAt, secondFinishAt);

    expect(firstPublication.equals(secondPublication)).toBe(false);
  });

  it('is not equal when finish dates are different', () => {
    const nowTime = new Date().getTime();

    const startAt = DateUtils.moveDate(now, {minutes: -5});
    const finishAt = DateUtils.moveDate(now, {minutes: 5});
    const firstPublication = new Publication(startAt, finishAt);

    const secondStartAt = DateUtils.moveDate(now, {minutes: -5});
    const secondFinishAt = DateUtils.moveDate(now, {minutes: 4});
    const secondPublication = new Publication(secondStartAt, secondFinishAt);

    expect(firstPublication.equals(secondPublication)).toBe(false);
  });
});