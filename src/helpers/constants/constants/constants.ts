import { QueryBlogDto } from "../commonDTO/query.dto";

export const queryDefault: QueryBlogDto = {
    pageNumber: '1',
    pageSize: '10', 
    sortBy: 'createdAt', 
    sortDirection: 'desc',
}