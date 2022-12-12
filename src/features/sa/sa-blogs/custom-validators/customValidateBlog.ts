import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { BlogsService } from '../application/blogs.service';

export function BlogIsExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogIsExistRule,
    });
  };
}

@ValidatorConstraint({ name: 'BlogIsExist', async: false })
@Injectable()
export class BlogIsExistRule implements ValidatorConstraintInterface {
  constructor(private blogService: BlogsService) {}

  async validate(value: string) {
    try {
      const blog = await this.blogService.findOneBlogById(value)
      if(blog) {
        return true
      } else return false
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}

