import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, Req} from '@nestjs/common';
import { Request } from 'express';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsService } from '../application/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CreateCommentDto } from '../../comments/dto/comment.dto';
import { BasicAuthGuard } from '../../../helpers/guards/auth.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import { CreateLikeDto } from '../../likes/dto/like.dto';
import { ExtractUserFromToken } from '../../../helpers/guards/extractUserFromToken.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private postsService: PostsService
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id/like-status')
    async like(@Param('id') id: string, @Body() likeDto: CreateLikeDto, @Req() req: Request){
        return await this.postsService.like(id, likeDto.likeStatus, req.user)
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id/comments')
    async findCommentsByPostId(@Param('id') id: string, @Query() query: QueryBlogDto, @Req() req: Request){
        return await this.postsService.findCommentsByPostId(id, query, req.user.userId)
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/comments')
    async createOneCommentByPostId(@Param('id') id: string, @Body() commentDto: CreateCommentDto, @Req() req: Request){
        return await this.postsService.createOneCommentByPostId(id, commentDto, req.user.userId)
    }

    @UseGuards(ExtractUserFromToken)
    @Get()
    async findAllPosts(@Query() query: QueryBlogDto, @Req() req: Request){
        return await this.postsService.findAllPosts(query, req.user.userId)
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createOnePost(@Body() postDto: CreatePostDto){
        return await this.postsService.createOnePost(postDto)
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id')
    async findOnePostById(@Param('id') id: string, @Req() req: Request){
        return await this.postsService.findOnePostById(id, req.user.userId)
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