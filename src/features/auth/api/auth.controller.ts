import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import { Cookies } from '../../../helpers/customdecorators/cookie.decorator';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import {AuthService} from "../application/auth.service";
import { PasswordRecoveryDto, AuthDto, RegistrationConfirmationDto, RegistrationDto, RegistrationEmailResendingDto, NewPasswordDto } from '../dto/auth.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

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
    async login(@Body() authDto: AuthDto, @Req() req, @Res({ passthrough: true }) res){
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

        return { accessToken: result.accessToken };
    }

    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @Post('refresh-token')
    async refreshTokens(@Cookies() cookie, @Res({ passthrough: true }) res){
        const result = await this.authService.refreshTokens(cookie.refreshToken)

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return { accessToken: result.accessToken };
    }

    @HttpCode(204)
    @Post('registration-confirmation')
    registrationConfirmation(@Body() registrationConfirmationDto: RegistrationConfirmationDto ){
        return this.authService.registrationConfirmation(registrationConfirmationDto)
    }

    @HttpCode(204)
    @Post('registration')
    registration(@Body() registrationDto: RegistrationDto ){
        return this.authService.registration(registrationDto)
    }

    @HttpCode(204)
    @Post('registration-email-resending')
    registrationEmailResending(@Body() registrationEmailResendingDto: RegistrationEmailResendingDto ){
        return this.authService.registrationEmailResending(registrationEmailResendingDto)
    }

    @HttpCode(204)
    @UseGuards(JWTAuthGuard)
    @Post('logout')
    logout(@Cookies() cookie){
        return this.authService.logout(cookie.refreshToken)
    }

    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @Get('me')
    getAuthMe(@Req() req){
        return this.authService.authMe(req.user.id)
    }

}