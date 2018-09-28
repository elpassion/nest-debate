import DateProvider from '../date_provider';

describe('DateProvider', () => {
  const ONE_SECOND = 1000;
  const ONE_MINUTE = 60 * ONE_SECOND;

  it('provides current date', () => {
    const realCurrentTimestamp = new Date().getTime();
    const currentTimestamp = DateProvider.getCurrentDate().getTime();

    expect(currentTimestamp).toBeLessThanOrEqual(realCurrentTimestamp + ONE_SECOND);
    expect(currentTimestamp).toBeGreaterThanOrEqual(realCurrentTimestamp);
  });

  it('allows setting custom strategy for current date generation', () => {
    const testTimestamp = new Date().getTime() + (45 * ONE_MINUTE);
    const customDateGenerationStrategy = () => new Date(testTimestamp);

    DateProvider.dateGenerationStrategy = customDateGenerationStrategy;

    const currentTimestamp = DateProvider.getCurrentDate().getTime();
    expect(currentTimestamp).toEqual(testTimestamp);
  });
});