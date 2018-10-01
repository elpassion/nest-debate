import DateUtils from '../date_utils';

describe('DateUtils', () => {
  const minute = 1000 * 60;
  const hour   = 60 * minute;
  const day    = 24 * hour;
  const currentDate = new Date();

  describe('.fromNow', () => {
    it('returns date moved by specified amount', () => {
      const fiveMinutes = 5 * minute;
      const twoHours = 2 * hour;
      const threeDays =  3 * day;
      const futureDate = new Date(currentDate.getTime() + threeDays + twoHours + fiveMinutes);

      expect(DateUtils.moveDate(currentDate, {minutes: 5, hours: 2, days: 3}).getTime()).toBe(futureDate.getTime());
    });

    it('returns date moved backward', () => {
      const fiveMinutes = 5 * minute;
      const twoHours = 2 * hour;
      const threeDays =  3 * day;
      const previousDate = new Date(currentDate.getTime() - threeDays - twoHours - fiveMinutes);

      expect(DateUtils.moveDate(currentDate, {minutes: -5, hours: -2, days: -3}).getTime()).toBe(previousDate.getTime());
    });

    it('returns date moved by days only', () => {
      const futureDate = new Date(currentDate.getTime() + 2 * day);

      expect(DateUtils.moveDate(currentDate, {days: 2}).getTime()).toBe(futureDate.getTime());
    });

    it('returns date moved by hours only', () => {
      const futureDate = new Date(currentDate.getTime() + 3 * hour);

      expect(DateUtils.moveDate(currentDate, {hours: 3}).getTime()).toBe(futureDate.getTime());
    });

    it('returns date moved by minutes only', () => {
      const futureDate = new Date(currentDate.getTime() + 5 * minute);

      expect(DateUtils.moveDate(currentDate, {minutes: 5}).getTime()).toBe(futureDate.getTime());
    });
  });

  describe('.copy', () => {
    it('copies provided date', () => {
      const date = new Date();
      const dateCopy = DateUtils.copy(date);

      expect(dateCopy).not.toBe(date);
      expect(dateCopy.getTime()).toBe(date.getTime());
    });
  });
});