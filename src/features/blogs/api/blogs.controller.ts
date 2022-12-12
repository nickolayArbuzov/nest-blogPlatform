import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDefaultDto } from '../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BasicAuthGuard } from '../../../helpers/guards/auth.guard';
import { ExtractUserFromToken } from '../../../helpers/guards/extractUserFromToken.guard';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) {}

    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.blogsService.findAllBlogs(query)
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id/posts')
    async findPostsByBlogId(@Query() query: QueryBlogDto, @Param('id') id: string, @Req() req: Request){
        return this.blogsService.findPostsByBlogId(query, id, req.user?.userId)
    }

    @Get(':id')
    async findOneBlogById(@Param('id') id: string){
        return this.blogsService.findOneBlogById(id)
    }
    
}