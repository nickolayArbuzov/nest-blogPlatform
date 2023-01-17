import { Transform, TransformFnParams } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateCommentDto {
    
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @Length(20, 300)
    readonly content: string;
}

export class UpdateCommentDto extends CreateCommentDto {}