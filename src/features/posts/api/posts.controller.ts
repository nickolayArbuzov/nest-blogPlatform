import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query} from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsService } from '../application/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private postService: PostsService
    ) {}

    @Get(':id/comments')
    async findCommentsByPostId(@Param('id') id: string, @Query() query: QueryBlogDto){
        return await this.postService.findCommentsByPostId(id, query)
    }

    @Get()
    async findAllPosts(@Query() query: QueryBlogDto){
        return await this.postService.findAllPosts(query)
    }

    @Post()
    async createOnePost(@Body() postDto: CreatePostDto){
        return await this.postService.createOnePost(postDto)
    }

    @Get(':id')
    async findOnePostById(@Param('id') id: string){
        return await this.postService.findOnePostById(id)
    }

    @HttpCode(204)
    @Put(':id')
    async updateOnePostById(@Param('id') id: string, @Body() postDto: UpdatePostDto){
        return await this.postService.updateOnePostById(id, postDto)
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteOnePostById(@Param('id') id: string){
        return await this.postService.deleteOnePostById(id)
    }
}