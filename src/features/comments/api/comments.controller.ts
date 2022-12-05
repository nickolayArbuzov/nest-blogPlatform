import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsService: CommentsService
    ) {}
    
    @Get(':id')
    findOneCommentById(@Param('id') id: string){
        return this.commentsService.findOneCommentById(id)
    }
}