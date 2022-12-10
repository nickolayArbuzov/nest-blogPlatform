import {Body, Controller, Delete, Get, HttpCode, Param, Put, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { CreateLikeDto } from '../../likes/dto/like.dto';
import { ExtractUserFromToken } from '../../../helpers/guards/extractUserFromToken.guard';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import { CommentsService } from '../application/comments.service';
import { UpdateCommentDto } from '../dto/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsService: CommentsService
    ) {}

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id/like-status')
    async like(@Param('id') id: string, @Body() likeDto: CreateLikeDto, @Req() req: Request){
        return await this.commentsService.like(id, likeDto.likeStatus, req.user)
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Put(':id')
    async updateOneCommentById(@Param('id') id: string, @Body() commentDto: UpdateCommentDto, @Req() req: Request){
        return await this.commentsService.updateOneCommentById(id, commentDto, req.user.userId)
    }

    @UseGuards(JWTAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneCommentById(@Param('id') id: string, @Req() req: Request){
        return await this.commentsService.deleteOneCommentById(id, req.user.userId)
    }
    
    @UseGuards(ExtractUserFromToken)
    @Get(':id')
    async findOneCommentById(@Param('id') id: string, @Req() req: Request){
        return await this.commentsService.findOneCommentById(id, req.user.userId)
    }
}