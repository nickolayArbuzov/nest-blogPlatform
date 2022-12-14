export class QueryBlogDto {
    readonly pageNumber: string;
    readonly pageSize: string;
    readonly sortBy: string;
    readonly searchNameTerm?: string;
    readonly sortDirection: "desc" | "asc";
}

export class QueryUserDto {
    readonly banStatus: "all" | "banned" | "notBanned";
    readonly pageNumber: string;
    readonly pageSize: string;
    readonly sortBy: string;
    readonly searchLoginTerm?: string;
    readonly searchEmailTerm?: string;
    readonly sortDirection: "desc" | "asc";
}