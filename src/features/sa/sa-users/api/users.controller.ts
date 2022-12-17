import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { CreateUserDto } from '../dto/user.dto';
import { BasicAuthGuard } from '../../../../helpers/guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOneUserCommand } from '../application/use-cases/CreateOneUser';
import { DeleteOneUserByIdCommand } from '../application/use-cases/DeleteOneUserById';
import { FindAllUsersQuery } from '../application/use-cases/FindAllUsers';
import { BanOneUserByIdCommand } from '../application/use-cases/BanOneUserById';
import { BanUserDto } from '../../../../shared/dto/ban.dto';
import { Logger } from '../../../../helpers/guards/logger.guard';

@UseGuards(Logger)
@Controller('sa/users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    @Put(':id/ban')
    async banOneUserById(@Param('id') id: string, @Body() banUserDto: BanUserDto){
        return await this.commandBus.execute(new BanOneUserByIdCommand(id, banUserDto))
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