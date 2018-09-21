import Publication, { StartIsNotBeforeFinish } from './publication';

describe('Publication', () => {
  it('does not last by default', () => {
    const publication = new Publication();
    expect(publication.lastsAt(new Date())).toBe(false);
  });

  it('lasts from provided time', () => {
    const startAt = new Date(new Date().getTime() - 1000 * 60 * 5);
    const publication = new Publication(startAt);

    expect(publication.lastsAt(startAt)).toBe(true);
    expect(publication.lastsAt(new Date())).toBe(true);
  });

  it('lasts until provided finish time', () => {
    const startAt = new Date();
    const finishAt = new Date(startAt.getTime() + 1000 * 60 * 5);

    const publication = new Publication(startAt, finishAt);

    expect(publication.lastsAt(finishAt)).toBe(false);
  });

  // tslint:disable-next-line:quotemark
  it("can't be created with start time after end time", () => {
    expect(() => {
      const nowTime = new Date().getTime();
      const startAt = new Date(nowTime + 1000 * 60 * 5);
      const finishAt = new Date(nowTime - 1000 * 60 * 5);
      new Publication(startAt, finishAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });

  it('can be started', () => {
    const startAt = new Date(new Date().getTime() - 1000 * 60 * 5);
    const publication = new Publication().startAt(startAt);

    expect(publication.lastsAt(startAt)).toBe(true);
    expect(publication.lastsAt(new Date())).toBe(true);
  });

  it('can be finished', () => {
    const startAt = new Date();
    const finishAt = new Date(startAt.getTime() + 1000 * 60 * 5);

    const publication = new Publication(startAt).finishAt(finishAt);

    expect(publication.lastsAt(finishAt)).toBe(false);
  });

  // tslint:disable-next-line:quotemark
  it("can't be started after finish", () => {
    const nowTime = new Date().getTime();
    const startAt = new Date(nowTime + 1000 * 60 * 5);
    const finishAt = new Date(nowTime - 1000 * 60 * 5);

    const publication = new Publication().finishAt(finishAt);

    expect(() => {
      publication.startAt(startAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });

  // tslint:disable-next-line:quotemark
  it("can't be finished before start", () => {
    const nowTime = new Date().getTime();
    const startAt = new Date(nowTime + 1000 * 60 * 5);
    const finishAt = new Date(nowTime - 1000 * 60 * 5);

    const publication = new Publication(startAt);

    expect(() => {
      publication.finishAt(finishAt);
    }).toThrowError(StartIsNotBeforeFinish);
  });
});