import { IValueObject } from './value_object';

export default abstract class AggregateId implements IValueObject {
  constructor(private _id: string) { }

  public abstract equals(other: any): boolean;

  public get id() { return this._id; }
}