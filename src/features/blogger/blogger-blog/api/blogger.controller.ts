import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BloggerService } from '../application/blogger.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blogger.dto';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';

@Controller('blogger/blogs')
export class BloggerController {
    constructor(
        private bloggerService: BloggerService
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneBlogById(@Param('id') id: string){
        return this.bloggerService.deleteOneBlogById(id)
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOneBlogById(@Param('id') id: string, @Body() blogDto: UpdateBlogDto){
        return this.bloggerService.updateOneBlogById(id, blogDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/posts')
    async createOnePostForBlogId(@Param('id') id: string, @Body() postDto: CreatePostDefaultDto){
        return this.bloggerService.createOnePostForBlogId(id, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Put(':blogId/posts/:postId')
    async updateOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return this.bloggerService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Delete(':blogId/posts/:postId')
    async deleteOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return this.bloggerService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post()
    async createOneBlog(@Body() blogDto: CreateBlogDto){
        return this.bloggerService.createOneBlog(blogDto);
    }

    @UseGuards(JWTAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.bloggerService.findAllBlogs(query)
    }

}