import { IValueObject } from './value_object';

export default abstract class AggregateId implements IValueObject {
  constructor(private _id: string) { }

  public abstract equals(other: any): boolean;

  public toString(): string {
    return this.id;
  }

  public get id() { return this._id; }
}