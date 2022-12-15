import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';
import { BanUserByIdByIdCommand } from '../application/use-cases/BanUserByIdById';
import { FindAllBannedUsersQuery } from '../application/use-cases/FindAllBannedUsers';


@Controller('blogger/users')
export class BloggerController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id/ban')
    async banUserByIdById(@Param('id') id: string, @Req() req: Request){
        return await this.commandBus.execute(new BanUserByIdByIdCommand())
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Get('blog/:id')
    async findAllBannedUsers(@Param('id') id: string, @Req() req: Request){
        return await this.queryBus.execute(new FindAllBannedUsersQuery())
    }

}