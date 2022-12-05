import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query} from '@nestjs/common';
import { QueryUserDto } from '../../../helpers/constants/commonDTO/query.dto';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @Get()
    async findAllUsers(@Query() query: QueryUserDto){
        return await this.usersService.findAllUsers(query)
    }

    @Post()
    async createOneUser(@Body() userDto: CreateUserDto){
        return await this.usersService.createOneUser(userDto)
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteOneUserById(@Param('id') id: string){
        return await this.usersService.deleteOneUserById(id)
    }
}