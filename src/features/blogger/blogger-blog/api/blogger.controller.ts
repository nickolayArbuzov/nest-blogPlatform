import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { CreatePostDefaultDto, UpdatePostDefaultDto } from '../../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blogger.dto';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';
import { DeleteOneBlogByIdCommand } from '../application/use-cases/DeleteOneBlogById';
import { UpdateOneBlogByIdCommand } from '../application/use-cases/UpdateOneBlogById';
import { CreateOnePostForBlogIdCommand } from '../application/use-cases/CreateOnePostForBlogId';
import { UpdateOnePostOverBlogCommand } from '../application/use-cases/UpdateOnePostOverBlog';
import { DeleteOnePostOverBlogCommand } from '../application/use-cases/DeleteOnePostOverBlog';
import { FindAllBlogsQuery } from '../application/use-cases/FindAllBlogs';
import { CreateOneBlogCommand } from '../application/use-cases/CreateOneBlog';
import { FindAllCommentsForUsersBlogsQuery } from '../application/use-cases/FindAllCommentsForUsersBlogs';
import { Logger } from '../../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('blogger/blogs')
export class BloggerController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JWTAuthGuard)
    @Get('comments')
    async findAllCommentsForUsersBlogs(@Query() query: QueryBlogDto, @Req() req: Request){
        return await this.queryBus.execute(new FindAllCommentsForUsersBlogsQuery(query, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneBlogById(@Param('id') id: string, @Req() req: Request){
        return await this.commandBus.execute(new DeleteOneBlogByIdCommand(id, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOneBlogById(@Param('id') id: string, @Body() blogDto: UpdateBlogDto, @Req() req: Request){
        return await this.commandBus.execute(new UpdateOneBlogByIdCommand(id, blogDto, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/posts')
    async createOnePostForBlogId(@Param('id') id: string, @Body() postDto: CreatePostDefaultDto, @Req() req: Request){
        return await this.commandBus.execute(new CreateOnePostForBlogIdCommand(id, postDto, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':blogId/posts/:postId')
    async updateOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: UpdatePostDefaultDto, @Req() req: Request){
        return await this.commandBus.execute(new UpdateOnePostOverBlogCommand(blogId, postId, postDto, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':blogId/posts/:postId')
    async deleteOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Req() req: Request){
        return await this.commandBus.execute(new DeleteOnePostOverBlogCommand(blogId, postId, req.user.userId))
    }

    @UseGuards(JWTAuthGuard)
    @Post()
    async createOneBlog(@Body() blogDto: CreateBlogDto, @Req() req: Request){
        return await this.commandBus.execute(new CreateOneBlogCommand(blogDto, req.user))
    }

    @UseGuards(JWTAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto, @Req() req: Request){
        return await this.queryBus.execute(new FindAllBlogsQuery(query, req.user.userId))
    }

}