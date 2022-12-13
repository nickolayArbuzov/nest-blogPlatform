import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { AttemptsGuard } from '../../../helpers/guards/attempts.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import {AuthService} from "../application/auth.service";
import { PasswordRecoveryDto, AuthDto, RegistrationConfirmationDto, RegistrationDto, RegistrationEmailResendingDto, NewPasswordDto } from '../dto/auth.dto';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { LoggerRepo } from '../../../helpers/logger/infrastructure/logger.repo';
import { GetAuthMeQuery } from '../application/use-cases/GetAuthMe';
import { LogoutCommand } from '../application/use-cases/Logout';
import { RegistrationEmailResendingCommand } from '../application/use-cases/RegistrationEmailResending';
import { RegistrationCommand } from '../application/use-cases/Registration';
import { RegistrationConfirmationCommand } from '../application/use-cases/RegistrationConfirmation';
import { RefreshTokensCommand } from '../application/use-cases/RefreshTokens';
import { LoginCommand } from '../application/use-cases/Login';
import { NewPasswordCommand } from '../application/use-cases/NewPassword';
import { PasswordRecoveryCommand } from '../application/use-cases/PasswordRecovery';


@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private loggerRepo: LoggerRepo,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @HttpCode(204)
    @Post('password-recovery')
    async passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto){
        return await this.commandBus.execute(new PasswordRecoveryCommand(passwordRecoveryDto))
        return this.authService.passwordRecovery(passwordRecoveryDto)
    }

    @HttpCode(204)
    @Post('new-password')
    async newPassword(newPasswordDto: NewPasswordDto){
        return await this.commandBus.execute(new NewPasswordCommand(newPasswordDto))
        return this.authService.newPassword(newPasswordDto)
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() authDto: AuthDto, @Req() req: Request, @Res({ passthrough: true }) res: Response){
        //const result = await this.authService.login(authDto, req.ip, req.headers['user-agent'] || '')
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
        this.loggerRepo.createLog({path: req.path, comment: 'login', token: result.refreshToken, date: new Date().toISOString()})    
        return { accessToken: result.accessToken };
    }

    @HttpCode(200)
    @UseGuards(CookieGuard)
    @Post('refresh-token')
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        //const result = await this.authService.refreshTokens(req.cookies.refreshToken)
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
        this.loggerRepo.createLog({path: req.path, comment: 'after-refresh', token: result.refreshToken, date: new Date().toISOString()})
        return { accessToken: result.accessToken };
    }

    @HttpCode(204)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() registrationConfirmationDto: RegistrationConfirmationDto){
        return await this.commandBus.execute(new RegistrationConfirmationCommand(registrationConfirmationDto))
        return this.authService.registrationConfirmation(registrationConfirmationDto)
    }

    @HttpCode(204)
    @Post('registration')
    async registration(@Body() registrationDto: RegistrationDto){
        return await this.commandBus.execute(new RegistrationCommand(registrationDto))
        return this.authService.registration(registrationDto)
    }

    @HttpCode(204)
    @Post('registration-email-resending')
    async registrationEmailResending(@Body() registrationEmailResendingDto: RegistrationEmailResendingDto){
        return await this.commandBus.execute(new RegistrationEmailResendingCommand(registrationEmailResendingDto))
        return this.authService.registrationEmailResending(registrationEmailResendingDto)
    }

    @HttpCode(204)
    @UseGuards(CookieGuard)
    @Post('logout')
    async logout(@Req() req: Request){
        return await this.commandBus.execute(new LogoutCommand(req.cookies.refreshToken))
        return this.authService.logout(req.cookies.refreshToken)
    }

    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @Get('me')
    async getAuthMe(@Req() req: Request){
        return await this.queryBus.execute(new GetAuthMeQuery(req.user.userId))
        return this.authService.authMe(req.user.userId)
    }

}