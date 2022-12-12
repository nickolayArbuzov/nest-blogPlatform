import { IsString, Length, Matches, Validate } from "class-validator";
import { UserCodeIsConfirmedRule, UserLoginIsExistRule, UserMailCheckRule, UserMailIsExistRule } from "../../sa/sa-users/custom-validators/customValidateUser";

export class PasswordRecoveryDto {
    @IsString()
    @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
    readonly email: string;
}

export class NewPasswordDto {
    @IsString()
    @Length(6, 20)
    readonly newPassword: string;

    @Validate(UserCodeIsConfirmedRule)
    @IsString()
    readonly recoveryCode: string;
}

export class RegistrationEmailResendingDto {
    @Validate(UserMailCheckRule)
    @IsString()
    readonly email: string;
}

export class AuthDto {
    @IsString()
    readonly loginOrEmail: string;

    @IsString()
    readonly password: string;
}

export class RegistrationDto {
    @Validate(UserLoginIsExistRule)
    @IsString()
    @Length(3, 10)
    readonly login: string;

    @IsString()
    @Length(6, 20)
    readonly password: string;
    
    @Validate(UserMailIsExistRule)
    @IsString()
    @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
    readonly email: string;
}

export class RegistrationConfirmationDto {
    @Validate(UserCodeIsConfirmedRule)
    @IsString()
    readonly code: string;
}




