import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { AttemptsGuard } from '../../../helpers/guards/attempts.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import {AuthService} from "../application/auth.service";
import { PasswordRecoveryDto, AuthDto, RegistrationConfirmationDto, RegistrationDto, RegistrationEmailResendingDto, NewPasswordDto } from '../dto/auth.dto';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { GetAuthMeQuery } from '../application/use-cases/GetAuthMe';
import { LogoutCommand } from '../application/use-cases/Logout';
import { RegistrationEmailResendingCommand } from '../application/use-cases/RegistrationEmailResending';
import { RegistrationCommand } from '../application/use-cases/Registration';
import { RegistrationConfirmationCommand } from '../application/use-cases/RegistrationConfirmation';
import { RefreshTokensCommand } from '../application/use-cases/RefreshTokens';
import { LoginCommand } from '../application/use-cases/Login';
import { NewPasswordCommand } from '../application/use-cases/NewPassword';
import { PasswordRecoveryCommand } from '../application/use-cases/PasswordRecovery';
import { Logger } from '../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    //@UseGuards(AttemptsGuard)
    @HttpCode(204)
    @Post('password-recovery')
    async passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto){
        return await this.commandBus.execute(new PasswordRecoveryCommand(passwordRecoveryDto))
    }

    //@UseGuards(AttemptsGuard)
    @HttpCode(204)
    @Post('new-password')
    async newPassword(newPasswordDto: NewPasswordDto){
        return await this.commandBus.execute(new NewPasswordCommand(newPasswordDto))
    }

    //@UseGuards(AttemptsGuard)
    @HttpCode(200)
    @Post('login')
    async login(@Body() authDto: AuthDto, @Req() req: Request, @Res({ passthrough: true }) res: Response){
        const result = await this.commandBus.execute(new LoginCommand(authDto, req.ip, req.headers['user-agent'] || ''))
        res.cookie(
            'refreshToken', 
            result.refreshToken, 
            {
                httpOnly: true,
                secure: true,
                maxAge: 24*60*60*1000,
            }
        );
        return { accessToken: result.accessToken };
    }

    @HttpCode(200)
    @UseGuards(CookieGuard)
    @Post('refresh-token')
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        const result = await this.commandBus.execute(new RefreshTokensCommand(req.cookies.refreshToken))
        res.cookie(
            'refreshToken', 
            result.refreshToken, 
            {
                httpOnly: true,
                secure: true,
                maxAge: 24*60*60*1000,
            }
        );
        return { accessToken: result.accessToken };
    }

    //@UseGuards(AttemptsGuard)
    @HttpCode(204)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() registrationConfirmationDto: RegistrationConfirmationDto){
        return await this.commandBus.execute(new RegistrationConfirmationCommand(registrationConfirmationDto))
    }

    //@UseGuards(AttemptsGuard)
    @HttpCode(204)
    @Post('registration')
    async registration(@Body() registrationDto: RegistrationDto){
        return await this.commandBus.execute(new RegistrationCommand(registrationDto))
    }

    //@UseGuards(AttemptsGuard)
    @HttpCode(204)
    @Post('registration-email-resending')
    async registrationEmailResending(@Body() registrationEmailResendingDto: RegistrationEmailResendingDto){
        return await this.commandBus.execute(new RegistrationEmailResendingCommand(registrationEmailResendingDto))
    }

    @HttpCode(204)
    @UseGuards(CookieGuard)
    @Post('logout')
    async logout(@Req() req: Request){
        return await this.commandBus.execute(new LogoutCommand(req.cookies.refreshToken))
    }

    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @Get('me')
    async getAuthMe(@Req() req: Request){
        return await this.queryBus.execute(new GetAuthMeQuery(req.user.userId))
    }

}