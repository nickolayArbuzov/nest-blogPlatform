import {Controller, Get} from '@nestjs/common';
import { LoggerRepo } from '../infrastructure/logger.repo';

@Controller('logger')
export class LoggerController {
    constructor(
        private loggerRepo: LoggerRepo,
    ) {}

    @Get()
    async findAllUsers(){
        return await this.loggerRepo.getLogs()
    }
}