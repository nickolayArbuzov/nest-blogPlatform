import { Controller, Get, Param, Query, Req, UseGuards} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsService } from '../application/blogs.service';
import { ExtractUserFromToken } from '../../../helpers/guards/extractUserFromToken.guard';
import { FindAllBlogsQuery } from '../application/use-cases/FindAllBlogs';
import { FindPostsByBlogIdQuery } from '../application/use-cases/FindPostsByBlogId';
import { FindOneBlogByIdQuery } from '../application/use-cases/FindOneBlogById';
import { Logger } from '../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService,
        private queryBus: QueryBus,
    ) {}

    @Get()
    async findAllBlogs(@Query() query: QueryBlogDto){
        const blogs = await this.queryBus.execute(new FindAllBlogsQuery(query))
        return blogs
    }

    @UseGuards(ExtractUserFromToken)
    @Get(':id/posts')
    async findPostsByBlogId(@Query() query: QueryBlogDto, @Param('id') id: string, @Req() req: Request){
        return await this.queryBus.execute(new FindPostsByBlogIdQuery(query, id, req.user?.userId))
    }

    @Get(':id')
    async findOneBlogById(@Param('id') id: string){
        return await this.queryBus.execute(new FindOneBlogByIdQuery(id))
    }
    
}