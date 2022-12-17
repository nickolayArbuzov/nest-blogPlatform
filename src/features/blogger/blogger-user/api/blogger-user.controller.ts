import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';
import { BanUserByIdCommand } from '../application/use-cases/BanUserById';
import { FindAllBannedUsersByBlogIdQuery } from '../application/use-cases/FindAllBannedUsersByBlogId';
import { Logger } from '../../../../helpers/guards/logger.guard';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';

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
    async banUserById(@Param('id') userId: string, @Body() banUserBlogDto: BanUserBlogDto, @Req() req: Request){
        return await this.commandBus.execute(new BanUserByIdCommand(userId, banUserBlogDto, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @Get('blog/:id')
    async findAllBannedUsersByBlogId(@Query() query: QueryUserDto, @Param('id') blogId: string, @Req() req: Request){
        return await this.queryBus.execute(new FindAllBannedUsersByBlogIdQuery(query, blogId, req.user.userId))
    }

}