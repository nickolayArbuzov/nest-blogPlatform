import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BanOneBlogByIdCommand } from '../application/use-cases/BanOneBlogById';
import { BindBlogWithUserCommand } from '../application/use-cases/BindBlogWithUser';
import { FindAllBlogsQuery } from '../application/use-cases/FindAllBlogs';
import { BanBlogDto } from '../../../../shared/dto/ban.dto';

@Controller('sa/blogs')
export class BlogsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(BasicAuthGuard)
    @Put(':id/ban')
    async banOneBlogById(@Param('id') id: string, @Body() banBlogDto: BanBlogDto){
        return await this.commandBus.execute(new BanOneBlogByIdCommand(id, banBlogDto))
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id/bind-with-user/:userId')
    async bindBlogWithUser(@Param('id') id: string, @Param('userId') userId: string){
        return await this.commandBus.execute(new BindBlogWithUserCommand(id, userId))
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.queryBus.execute(new FindAllBlogsQuery(query))
    }
    
}