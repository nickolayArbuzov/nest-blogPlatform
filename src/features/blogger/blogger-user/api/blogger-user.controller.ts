import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';
import { BanUserByIdCommand } from '../application/use-cases/BanUserById';
import { FindAllBannedUsersByBlogIdQuery } from '../application/use-cases/FindAllBannedUsersByBlogId';
import { Logger } from '../../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('blogger/users')
export class BloggerUserController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id/ban')
    async banUserById(@Param('id') userId: string, @Body() banUserBlogDto: BanUserBlogDto){
        return await this.commandBus.execute(new BanUserByIdCommand(userId, banUserBlogDto))
    }

    @UseGuards(JWTAuthGuard)
    @Get('blog/:id')
    async findAllBannedUsersByBlogId(@Param('id') blogId: string, @Req() req: Request){
        return await this.queryBus.execute(new FindAllBannedUsersByBlogIdQuery(blogId))
    }

}