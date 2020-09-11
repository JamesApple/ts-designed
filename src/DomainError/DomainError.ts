export class DomainError extends Error {
  private previousError?: DomainError | Error;

  statusCode = 500;
  apiCode = "INTERNAL_ERROR";

  message: string;
  longMessage = "An internal error has occured. Please try again later.";

  details: {[key: string]: any} = {};

  getCause(): Error | undefined {
    return this.previousError;
  }

  getRootCause(): Error | undefined {
    const previousErrors = this.getPreviousErrors();
    return previousErrors[previousErrors.length - 1];
  }

  getPreviousErrors(): Error[] {
    const {previousError} = this;
    if (!previousError) return [];
    if (previousError instanceof DomainError) {
      return [previousError, ...previousError.getPreviousErrors()];
    }
    return [previousError];
  }

  get name(): string {
    return this.previousError
      ? `${this._name}(${this.previousError.name})`
      : this._name;
  }

  private get _name(): string {
    return this.constructor.name;
  }

  toString(): string {
    const currentErrorString = `${this._name}: ${this.message}`;
    return this.previousError
      ? `${currentErrorString}\n\t${this.previousError.toString()}`
      : currentErrorString;
  }

  static wrap<T extends typeof DomainError>(
    this: T,
    error: Error,
    ...rest: Parameters<T["create"]>
  ): InstanceType<T> {
    const domainError = this.create(...(rest as any));
    domainError.previousError = error;
    return domainError;
  }

  static create<T extends typeof DomainError>(
    this: T,
    message?: string,
    overrides?: Partial<InstanceType<T>>
  ): InstanceType<T> {
    const error = new this(message) as InstanceType<T>;
    if (overrides) {
      Object.assign(error, overrides);
    }
    return error;
  }
}
