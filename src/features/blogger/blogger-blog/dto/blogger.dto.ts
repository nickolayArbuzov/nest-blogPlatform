import { Transform, TransformFnParams } from "class-transformer";
import { IsString, Length, Matches } from "class-validator";

export class CreateBlogDto {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(1, 15)
    readonly name: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(1, 500)
    readonly description: string;
    
    @IsString()
    @Length(1, 100)
    @Matches(/^(https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$)/)
    readonly websiteUrl: string;
}

export class UpdateBlogDto extends CreateBlogDto {}