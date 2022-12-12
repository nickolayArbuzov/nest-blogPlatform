import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { UsersService } from '../application/users.service';
import { BanDto, CreateUserDto } from '../dto/user.dto';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';

@Controller('sa/users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private usersService: UsersService,
    ) {}

    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    @Put(':id/ban')
    async banOneUserById(@Param('id') id: string, @Body() banDto: BanDto){
        return await this.usersService.banOneUserById(id, banDto)
    }

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