import {DomainError} from "./DomainError";

export class EntityValidationError extends DomainError {
  public causes: {path: string; issue: string}[] = [];

  statusCode = 500;
  apiCode = "VALIDATION_ERROR";

  message: string;
  longMessage = "A validation error occurred.";

  protected addCause(error: {path: string; issue: string}) {
    this.causes.push(error);
  }

  static fromClassValidatorErrors(
    errors: ClassValidatorError[],
    path?: string,
    domainError = new EntityValidationError()
  ): EntityValidationError {
    try {
      errors.forEach((err) => {
        if (err.children?.length)
          this.fromClassValidatorErrors(
            err.children,
            err.property,
            domainError
          );
        domainError.addCause({
          path: path ? `${path}.${err.property}` : err.property,
          issue: Object.values(err.constraints ?? {}).join(", ")
        });
      });
      return domainError;
    } catch (e) {
      throw EntityValidationError.create("Validation error parsing failed", {
        previousError: e,
        details: {originalErrors: errors}
      });
    }
  }
}

interface ClassValidatorError {
  target?: Object;
  property: string;
  value?: any;
  constraints?: {
    [type: string]: string;
  };
  children: ClassValidatorError[];
  contexts?: {
    [type: string]: any;
  };
  toString(
    shouldDecorate?: boolean,
    hasParent?: boolean,
    parentPath?: string
  ): string;
}
