import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { QueryUserDto } from '../../../helpers/constants/commonDTO/query.dto';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../dto/user.dto';
import { BasicAuthGuard } from '../../../helpers/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(BasicAuthGuard)
    @Get()
    async findAllUsers(@Query() query: QueryUserDto){
        return await this.usersService.findAllUsers(query)
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createOneUser(@Body() userDto: CreateUserDto){
        return await this.usersService.createOneUser(userDto)
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneUserById(@Param('id') id: string){
        return await this.usersService.deleteOneUserById(id)
    }
}