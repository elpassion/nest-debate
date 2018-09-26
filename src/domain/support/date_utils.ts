export interface DateMoveDelta {
  days?: number;
  hours?: number;
  minutes?: number;
}

export default class DateUtils {
  static readonly SECOND = 1000;
  static readonly MINUTE = 60 * DateUtils.SECOND;
  static readonly HOUR   = 60 * DateUtils.MINUTE;
  static readonly DAY    = 24 * DateUtils.HOUR;

  public static moveDate(date: Date, by: DateMoveDelta): Date {
    const days = (by.days || 0) * DateUtils.DAY;
    const hours = (by.hours || 0) * DateUtils.HOUR;
    const minutes = (by.minutes || 0) * DateUtils.MINUTE;

    return new Date(date.getTime() + minutes + hours + days);
  }
}
