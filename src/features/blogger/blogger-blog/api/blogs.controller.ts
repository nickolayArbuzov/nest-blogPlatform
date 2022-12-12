import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';
import { ExtractUserFromToken } from '../../../../helpers/guards/extractUserFromToken.guard';
import { JWTAuthGuard } from '../../../../helpers/guards/jwt.guard';

@Controller('blogger/blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneBlogById(@Param('id') id: string){
        return this.blogsService.deleteOneBlogById(id)
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOneBlogById(@Param('id') id: string, @Body() blogDto: UpdateBlogDto){
        return this.blogsService.updateOneBlogById(id, blogDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/posts')
    async createOnePostForBlogId(@Param('id') id: string, @Body() postDto: CreatePostDefaultDto){
        return this.blogsService.createOnePostForBlogId(id, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Put(':blogId/posts/:postId')
    async updateOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return this.blogsService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Delete(':blogId/posts/:postId')
    async deleteOnePostOverBlog(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() postDto: CreatePostDefaultDto){
        return this.blogsService.createOnePostForBlogId(blogId, postDto)
    }

    @UseGuards(JWTAuthGuard)
    @Post()
    async createOneBlog(@Body() blogDto: CreateBlogDto){
        return this.blogsService.createOneBlog(blogDto);
    }

    @UseGuards(JWTAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.blogsService.findAllBlogs(query)
    }

}