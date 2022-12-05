import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query} from '@nestjs/common';
import { CreatePostDefaultDto } from '../../posts/dto/post.dto';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) {}

    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.blogsService.findAllBlogs(query)
    }

    @Post()
    async createOneBlog(@Body() blogDto: CreateBlogDto){
        return this.blogsService.createOneBlog(blogDto);
    }

    @Get(':id/posts')
    async findPostsByBlogId(@Query() query: QueryBlogDto, @Param('id') id: string){
        return this.blogsService.findPostsByBlogId(query, id)
    }

    @Post(':id/posts')
    async createOnePostForBlogId(@Param('id') id: string, @Body() postDto: CreatePostDefaultDto){
        return this.blogsService.createOnePostForBlogId(id, postDto)
    }

    @Get(':id')
    async findOneBlogById(@Param('id') id: string){
        return this.blogsService.findOneBlogById(id)
    }

    @HttpCode(204)
    @Put(':id')
    async updateOneBlogById(@Param('id') id: string, @Body() blogDto: UpdateBlogDto){
        return this.blogsService.updateOneBlogById(id, blogDto)
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteOneBlogById(@Param('id') id: string){
        return this.blogsService.deleteOneBlogById(id)
    }
    
}