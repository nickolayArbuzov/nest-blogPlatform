import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { DevicesService } from '../application/devices.service';

@Controller('posts')
export class DevicesController {
    constructor(
        private devicesService: DevicesService
    ) {}

    @UseGuards(CookieGuard)
    @Get()
    async findAllDevicesByCurrentUserId(){
        return await this.devicesService.findAllDevicesByCurrentUserId()
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete('')
    async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(){
        return await this.devicesService.deleteAllDeviceByCurrentUserIdExceptCurrentDevice()
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneDeviceById(@Param('id') id: string){
        return await this.devicesService.deleteOneDeviceById(id)
    }
}