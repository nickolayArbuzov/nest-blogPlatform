import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { CookieGuard } from '../../../helpers/guards/cookie.guard';
import { DevicesService } from '../application/devices.service';
import { DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceCommand } from '../application/use-cases/DeleteAllDeviceByCurrentUserIdExceptCurrentDevice';
import { DeleteOneDeviceByIdCommand } from '../application/use-cases/DeleteOneDeviceById';
import { FindAllDevicesByCurrentUserIdQuery } from '../application/use-cases/FindAllDevicesByCurrentUserId';
import { Logger } from '../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('security')
export class DevicesController {
    constructor(
        private devicesService: DevicesService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(CookieGuard)
    @Get('devices')
    async findAllDevicesByCurrentUserId(@Req() req: Request){
        return await this.queryBus.execute(new FindAllDevicesByCurrentUserIdQuery(req.cookies.refreshToken))
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete('devices')
    async deleteAllDeviceByCurrentUserIdExceptCurrentDevice(@Req() req: Request){
        return await this.commandBus.execute(new DeleteAllDeviceByCurrentUserIdExceptCurrentDeviceCommand(req.cookies.refreshToken))
    }

    @UseGuards(CookieGuard)
    @HttpCode(204)
    @Delete('devices/:id')
    async deleteOneDeviceById(@Param('id') id: string, @Req() req: Request){
        return await this.commandBus.execute(new DeleteOneDeviceByIdCommand(id, req.cookies.refreshToken))
    }
}