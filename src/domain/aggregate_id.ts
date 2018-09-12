export default class AggregateId<T> {
  constructor(private _id: string) { }

  public get id() { return this._id; }
}