import { IsBoolean, IsString, Length } from "class-validator";

export class BanBlogDto {
    @IsBoolean()
    readonly isBanned: boolean;
}

export class BanUserDto extends BanBlogDto {
    @IsString()
    @Length(20)
    readonly banReason: string;
}