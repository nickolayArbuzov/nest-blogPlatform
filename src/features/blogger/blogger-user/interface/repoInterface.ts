import { QueryBlogDto } from "../../../../helpers/constants/commonDTO/query.dto"
import { CreateBlogDto } from "../dto/blogger.dto"

export interface IBlogRepoInterface {
    findAllCommentsByPostId(id: string, query: QueryBlogDto): any
    findOne(id: string): any
    create(postId: string, dto: CreateBlogDto, user: {id: string, login: string}): any
    updateOne(id: string, dto: CreateBlogDto, userId: string ): any
    deleteOne(id: string, userId: string): any
}