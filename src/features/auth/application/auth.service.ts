import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto, NewPasswordDto, PasswordRecoveryDto, RegistrationConfirmationDto, RegistrationDto, RegistrationEmailResendingDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import {v4} from 'uuid';
import { sendEmail } from '../../../adapters/mail.adapter';
import { UsersRepo } from '../../sa/sa-users/infrastructure/users.repo';
import { DevicesRepo } from '../../devices/infrastructure/devices.repo';
import { Device } from '../../devices/domain/entitites/device';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepo,
    private devicesRepo: DevicesRepo,
    private readonly jwtService: JwtService,
  ) {}

  async passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto){
    const code = v4()
    await this.usersRepo.passwordRecovery(passwordRecoveryDto.email, code)
    await sendEmail(passwordRecoveryDto.email, code, 'password-recovery?recoveryCode')
    return
  }

  async newPassword(newPasswordDto: NewPasswordDto){
    const passwordSalt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(newPasswordDto.newPassword, passwordSalt)
    return await this.usersRepo.newPassword(passwordHash, passwordSalt, newPasswordDto.recoveryCode)
  }

  async login(dto: AuthDto, ip: string, deviceName: string) {
    const auth = await this.usersRepo.findByLoginOrEmail(dto.loginOrEmail)
    if (!auth){
      throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED);
    }
    const candidateHash = await bcrypt.hash(dto.password, auth.passwordSalt.toString())
    if (auth.passwordHash.toString() === candidateHash) {

      const deviceId = v4()
      const device: Device = {
        ip: ip,
        title: deviceName, 
        deviceId: deviceId,
        issuedAt: new Date().getTime(),
        expiresAt: new Date().getTime() + 600000,
        userId: auth.id!.toString(),
      }
      const payloadAccess = {userId: auth?.id?.toString() ? auth?.id?.toString() : '', userLogin: auth.login, deviceId: device.deviceId, issuedAt: device.issuedAt}
      const payloadRefresh = {userId: auth?.id?.toString() ? auth?.id?.toString() : '', userLogin: auth.login, deviceId: device.deviceId, issuedAt: device.issuedAt}
      const accessToken = this.jwtService.sign(payloadAccess, {expiresIn: '5m'})
      const refreshToken = this.jwtService.sign(payloadRefresh, {expiresIn: '10m'})
      await this.devicesRepo.createDevice(device)
      return {
        accessToken,
        refreshToken
      }
    } 
    else {
      throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshTokens(refreshToken: string) {
    try{
      const refresh = this.jwtService.verify(refreshToken, {secret: 'secret'});
      const device = await this.devicesRepo.findOneDeviceByRefreshTokenData(refresh.deviceId, refresh.issuedAt)
      if(device) {
        const issuedAt = new Date().getTime()
        const expiresAt = new Date().getTime() + 600000
        const payloadAccess = {userId: device.userId, deviceId: device.deviceId, issuedAt: issuedAt}
        const payloadRefresh = {userId: device.userId, deviceId: device.deviceId, issuedAt: issuedAt}
        const accessToken = this.jwtService.sign(payloadAccess, {expiresIn: '5m'})
        const refreshToken = this.jwtService.sign(payloadRefresh, {expiresIn: '10m'})
        await this.devicesRepo.updateDevice(device.deviceId.toString(), issuedAt, expiresAt)
        return {
          accessToken,
          refreshToken
        }
      } else {
        throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
      }
    }
    catch(e){
      throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
    }
  }

  async registrationConfirmation(dto: RegistrationConfirmationDto) {
    return await this.usersRepo.registrationConfirmation(dto.code)
  }

  async registration(newUser: RegistrationDto) {
      const passwordSalt = await bcrypt.genSalt(8)
      const passwordHash = await bcrypt.hash(newUser.password, passwordSalt)
      const code = v4()

      const date = new Date()
      const user = {
        login: newUser.login,
        email: newUser.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        isActivated: false,
        code: code,
        createdAt: date.toISOString(),
        banInfo: {
          isBanned: false,
          banDate: date.toISOString(),
          banReason: "",
        },
      }

      await this.usersRepo.createOneUser(user)
      await sendEmail(newUser.email, code, 'confirm-email?code')
  }

  async registrationEmailResending(dto: RegistrationEmailResendingDto) {
    const code = v4()
    await this.usersRepo.registrationEmailResending(dto.email, code)
    await sendEmail(dto.email, code, 'confirm-registration?code')
    return true
  }

  async logout(refreshToken: string) {
    const refresh = this.jwtService.verify(refreshToken, {secret: 'secret'});
    const res = await this.devicesRepo.logout(refresh.userId, refresh.deviceId, refresh.issuedAt)
    if(res.deletedCount === 0) {
      throw new HttpException('Device not found', HttpStatus.UNAUTHORIZED)
    } else {
      return
    }
  }

  async authMe(userId: string) {
    const user = await this.usersRepo.authMe(userId)
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    }
  }
  
}