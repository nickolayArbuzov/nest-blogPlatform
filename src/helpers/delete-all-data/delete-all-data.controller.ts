import {Controller, Delete, HttpCode, UseGuards} from '@nestjs/common';
import { Logger } from '../guards/logger.guard';
import {AllDataService} from "./delete-all-data.service";

@UseGuards(Logger)
@Controller('testing')
export class AllDataController {

    constructor(private allDataService: AllDataService) {}

    @Delete('all-data')
    @HttpCode(204)
    async delete(){
       await this.allDataService.deleteAllData()
    }

}