import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BloggerService } from '../application/blogger.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blogger.dto';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';
import { DeleteOneBlogByIdCommand } from '../application/use-cases/DeleteOneBlogById';
import { UpdateOneBlogByIdCommand } from '../application/use-cases/UpdateOneBlogById';
import { CreateOnePostForBlogIdCommand } from '../application/use-cases/CreateOnePostForBlogId';
import { UpdateOnePostOverBlogCommand } from '../application/use-cases/UpdateOnePostOverBlog';
import { DeleteOnePostOverBlogCommand } from '../application/use-cases/DeleteOnePostOverBlog';
import { FindAllBlogsQuery } from '../application/use-cases/FindAllBlogs';
import { CreateOneBlogCommand } from '../application/use-cases/CreateOneBlog';

@Controller('blogger/blogs')
export class BloggerController {
    constructor(
        private bloggerService: BloggerService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneBlogById(@Param('id') id: string){
        return await this.commandBus.execute(new DeleteOneBlogByIdCommand(id))
        return this.bloggerService.deleteOneBlogById(id)
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOneBlogById(@Param('id') id: string, @Body() blogDto: UpdateBlogDto){
        return await this.commandBus.execute(new UpdateOneBlogByIdCommand(id, blogDto))
        return this.bloggerService.updateOneBlogById(id, blogDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/posts')
    async createOnePostForBlogId(@Param('id') id: string, @Body() postDto: CreatePostDefaultDto){
        return await this.commandBus.execute(new CreateOnePostForBlogIdCommand(id, postDto))
        return this.bloggerService.createOnePostForBlogId(id, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Put(':blogId/posts/:postId')
    async updateOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return await this.commandBus.execute(new UpdateOnePostOverBlogCommand(blogId))
        return this.bloggerService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Delete(':blogId/posts/:postId')
    async deleteOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return await this.commandBus.execute(new DeleteOnePostOverBlogCommand(blogId))
        return this.bloggerService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post()
    async createOneBlog(@Body() blogDto: CreateBlogDto){
        return await this.commandBus.execute(new CreateOneBlogCommand(blogDto))
        return this.bloggerService.createOneBlog(blogDto);
    }

    @UseGuards(JWTAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.queryBus.execute(new FindAllBlogsQuery(query))
        return await this.bloggerService.findAllBlogs(query)
    }

}