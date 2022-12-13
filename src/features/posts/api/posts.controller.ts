import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, Req} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsService } from '../application/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CreateCommentDto } from '../../comments/dto/comment.dto';
import { BasicAuthGuard } from '../../../helpers/guards/auth.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import { CreateLikeDto } from '../../likes/dto/like.dto';
import { ExtractUserFromToken } from '../../../helpers/guards/extractUserFromToken.guard';
import { LikeCommand } from '../application/use-cases/Like';
import { FindCommentsByPostIdQuery } from '../application/use-cases/FindCommentsByPostId';
import { CreateOneCommentByPostIdCommand } from '../application/use-cases/CreateOneCommentByPostId';
import { FindAllPostsQuery } from '../application/use-cases/FindAllPosts';
import { FindOnePostByIdQuery } from '../application/use-cases/FindOnePostById';
import { CreateOnePostCommand } from '../application/use-cases/CreateOnePost';
import { UpdateOnePostByIdCommand } from '../application/use-cases/UpdateOnePostById';
import { DeleteOnePostByIdCommand } from '../application/use-cases/DeleteOnePostById';

@Controller('posts')
export class PostsController {
    constructor(
        private postsService: PostsService,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id/like-status')
    async like(@Param('id') id: string, @Body() likeDto: CreateLikeDto, @Req() req: Request){
        return await this.commandBus.execute(new LikeCommand(id, likeDto.likeStatus, req.user))
        return await this.postsService.like(id, likeDto.likeStatus, req.user)
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id/comments')
    async findCommentsByPostId(@Param('id') id: string, @Query() query: QueryBlogDto, @Req() req: Request){
        return await this.queryBus.execute(new FindCommentsByPostIdQuery(id, query, req.user?.userId))
        return await this.postsService.findCommentsByPostId(id, query, req.user?.userId)
    }

    @UseGuards(JWTAuthGuard)
    @Post(':id/comments')
    async createOneCommentByPostId(@Param('id') id: string, @Body() commentDto: CreateCommentDto, @Req() req: Request){
        return await this.commandBus.execute(new CreateOneCommentByPostIdCommand(id, commentDto, req.user.userId))
        return await this.postsService.createOneCommentByPostId(id, commentDto, req.user.userId)
    }

    @UseGuards(ExtractUserFromToken)
    @Get()
    async findAllPosts(@Query() query: QueryBlogDto, @Req() req: Request){
        return await this.queryBus.execute(new FindAllPostsQuery(query, req.user?.userId))
        return await this.postsService.findAllPosts(query, req.user?.userId)
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createOnePost(@Body() postDto: CreatePostDto){
        return await this.commandBus.execute(new CreateOnePostCommand(postDto))
        return await this.postsService.createOnePost(postDto)
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id')
    async findOnePostById(@Param('id') id: string, @Req() req: Request){
        return await this.queryBus.execute(new FindOnePostByIdQuery(id, req.user?.userId))
        return await this.postsService.findOnePostById(id, req.user?.userId)
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOnePostById(@Param('id') id: string, @Body() postDto: UpdatePostDto){
        return await this.commandBus.execute(new UpdateOnePostByIdCommand(id, postDto))
        return await this.postsService.updateOnePostById(id, postDto)
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOnePostById(@Param('id') id: string){
        return await this.commandBus.execute(new DeleteOnePostByIdCommand(id))
        return await this.postsService.deleteOnePostById(id)
    }
}