import { IsEnum, IsNotEmpty } from 'class-validator';

export enum LikeVariants {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None',
}

export class CreateLikeDto {
    @IsNotEmpty()
    @IsEnum(LikeVariants)
    likeStatus: LikeVariants;
}