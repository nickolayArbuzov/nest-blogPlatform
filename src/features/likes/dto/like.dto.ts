import { IsEnum } from "class-validator";

export enum availableVariants {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None',
}

export class CreateLikeDto {
    @IsEnum(availableVariants, {each: true})
    readonly status: availableVariants;
}