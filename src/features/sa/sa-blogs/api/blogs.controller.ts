import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BlogsService } from '../application/blogs.service';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';

@Controller('sa/blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) {}

    @UseGuards(BasicAuthGuard)
    @Put(':id/bind-with-user/:userId')
    async bindBlogWithUser(@Param('id') id: string, @Param('userId') userId: string){
        return await this.blogsService.bindBlogWithUser(id, userId)
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        return await this.blogsService.findAllBlogs(query)
    }
    
}