import {Body, Controller, Delete, Get, HttpCode, Param, Put, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { JWTAuthGuard } from '../../../helpers/guards/jwt.guard';
import { CommentsService } from '../application/comments.service';
import { UpdateCommentDto } from '../dto/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsService: CommentsService
    ) {}

    @HttpCode(204)
    @Put(':id/like-status')
    async like(@Param('id') id: string){
        return true
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
    
    @Get(':id')
    async findOneCommentById(@Param('id') id: string){
        return await this.commentsService.findOneCommentById(id)
    }
}