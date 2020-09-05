export class Entity {
  static create<T extends typeof Entity, I extends InstanceType<T>>(
    this: T
  ): I {
    return new (this as any)();
  }
}
