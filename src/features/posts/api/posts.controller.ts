import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsService } from '../application/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { BasicAuthGuard } from '../../../helpers/guards/auth.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private postsService: PostsService
    ) {}

    @Get(':id/comments')
    async findCommentsByPostId(@Param('id') id: string, @Query() query: QueryBlogDto){
        return await this.postsService.findCommentsByPostId(id, query)
    }

    @Get()
    async findAllPosts(@Query() query: QueryBlogDto){
        return await this.postsService.findAllPosts(query)
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createOnePost(@Body() postDto: CreatePostDto){
        return await this.postsService.createOnePost(postDto)
    }

    @Get(':id')
    async findOnePostById(@Param('id') id: string){
        return await this.postsService.findOnePostById(id)
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOnePostById(@Param('id') id: string, @Body() postDto: UpdatePostDto){
        return await this.postsService.updateOnePostById(id, postDto)
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOnePostById(@Param('id') id: string){
        return await this.postsService.deleteOnePostById(id)
    }
}