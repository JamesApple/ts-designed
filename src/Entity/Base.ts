export namespace Entity {
  export class Base {
    static create<T extends typeof Base>(this: T): InstanceType<T> {
      return new this() as InstanceType<T>;
    }
  }
}
