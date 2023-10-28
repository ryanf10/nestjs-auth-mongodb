import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

type FieldError = {
  name: string;
  errors: Array<any>;
};
@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    });
  }

  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          this.handleError(e.getResponse()),
        );
      }
    }
  }

  private handleError(errors: any) {
    const { message, ...errorResponse } = errors;
    errorResponse['messages'] = [];
    message.forEach((error: ValidationError) => {
      const temp: FieldError = {
        name: error.property,
        errors: [],
      };
      for (const [, value] of Object.entries(error.constraints)) {
        temp.errors.push(value);
      }
      errorResponse['messages'].push(temp);
    });
    return errorResponse;
  }
}
