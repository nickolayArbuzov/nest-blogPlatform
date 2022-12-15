import { IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 10)
    readonly login: string;

    @IsString()
    @Length(6, 20)
    readonly password: string;
    
    @IsString()
    @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
    readonly email: string;
}