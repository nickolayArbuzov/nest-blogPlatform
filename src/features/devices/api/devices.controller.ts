import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { DevicesService } from '../application/devices.service';

@Controller('security')
export class DevicesController {
    constructor(
        private devicesService: DevicesService
    ) {}

    @UseGuards(CookieGuard)
    @Get('devices')
    async findAllDevicesByCurrentUserId(@Req() req: Request){
        return await this.devicesService.findAllDevicesByCurrentUserId(req.cookies.refreshToken)
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete('devices')
    async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(@Req() req: Request){
        return await this.devicesService.deleteAllDeviceByCurrentUserIdExceptCurrentDevice(req.cookies.refreshToken)
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete('devices/:id')
    async deleteOneDeviceById(@Param('id') id: string, @Req() req: Request){
        return await this.devicesService.deleteOneDeviceById(id, req.cookies.refreshToken)
    }
}