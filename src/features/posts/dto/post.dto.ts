import { Transform, TransformFnParams } from "class-transformer";
import { IsString, Length, Validate } from "class-validator";
import { BlogIsExistRule } from "../../blogs/custom-validators/customValidateBlog";

export class CreatePostDefaultDto {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(1, 30)
    readonly title: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(1, 100)
    readonly shortDescription: string;
    
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(1, 1000)
    readonly content: string;
}

export class UpdatePostDefaultDto extends CreatePostDefaultDto {}

export class CreatePostDto extends CreatePostDefaultDto {
    @IsString()
    @Validate(BlogIsExistRule)
    readonly blogId: string;
}

export class UpdatePostDto extends CreatePostDto {}

