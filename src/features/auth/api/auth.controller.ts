import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { AttemptsGuard } from '../../../helpers/guards/attempts.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import {AuthService} from "../application/auth.service";
import { PasswordRecoveryDto, AuthDto, RegistrationConfirmationDto, RegistrationDto, RegistrationEmailResendingDto, NewPasswordDto } from '../dto/auth.dto';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { LoggerRepo } from '../../../helpers/logger/infrastructure/logger.repo';


@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private loggerRepo: LoggerRepo,
    ) {}

    @HttpCode(204)
    @Post('password-recovery')
    async passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto){
        return this.authService.passwordRecovery(passwordRecoveryDto)
    }

    @HttpCode(204)
    @Post('new-password')
    async newPassword(newPasswordDto: NewPasswordDto){
        return this.authService.newPassword(newPasswordDto)
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() authDto: AuthDto, @Req() req: Request, @Res({ passthrough: true }) res: Response){
        const result = await this.authService.login(authDto, req.ip, req.headers['user-agent'] || '')

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
        const result = await this.authService.refreshTokens(req.cookies.refreshToken)

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
        return this.authService.registrationConfirmation(registrationConfirmationDto)
    }

    @HttpCode(204)
    @Post('registration')
    async registration(@Body() registrationDto: RegistrationDto){
        return this.authService.registration(registrationDto)
    }

    @HttpCode(204)
    @Post('registration-email-resending')
    async registrationEmailResending(@Body() registrationEmailResendingDto: RegistrationEmailResendingDto){
        return this.authService.registrationEmailResending(registrationEmailResendingDto)
    }

    @HttpCode(204)
    @UseGuards(CookieGuard)
    @Post('logout')
    async logout(@Req() req: Request){
        return this.authService.logout(req.cookies.refreshToken)
    }

    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @Get('me')
    async getAuthMe(@Req() req: Request){
        return this.authService.authMe(req.user.userId)
    }

}