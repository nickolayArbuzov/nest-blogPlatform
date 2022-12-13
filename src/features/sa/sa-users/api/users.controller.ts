import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { UsersService } from '../application/users.service';
import { BanDto, CreateUserDto } from '../dto/user.dto';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOneUserCommand } from '../application/use-cases/CreateOneUser';
import { DeleteOneUserByIdCommand } from '../application/use-cases/DeleteOneUserById';
import { FindAllUsersQuery } from '../application/use-cases/FindAllUsers';
import { BanOneUserByIdCommand } from '../application/use-cases/BanOneUserById';

@Controller('sa/users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    @Put(':id/ban')
    async banOneUserById(@Param('id') id: string, @Body() banDto: BanDto){
        return await this.commandBus.execute(new BanOneUserByIdCommand(id, banDto))
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async findAllUsers(@Query() query: QueryUserDto){
        return await this.queryBus.execute(new FindAllUsersQuery(query))
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createOneUser(@Body() userDto: CreateUserDto){
        return await this.commandBus.execute(new CreateOneUserCommand(userDto))
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async deleteOneUserById(@Param('id') id: string){
        return await this.commandBus.execute(new DeleteOneUserByIdCommand(id))
    }
}