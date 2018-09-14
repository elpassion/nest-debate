export default class DateProvider {
  public static dateGenerationStrategy: () => Date = () => new Date();

  public static getCurrentDate(): Date {
    return DateProvider.dateGenerationStrategy();
  }
}
