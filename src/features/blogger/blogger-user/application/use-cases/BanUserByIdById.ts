import { QueryHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';


export class BanUserByIdByIdCommand {
  constructor(

  ) {}
}

@QueryHandler(BanUserByIdByIdCommand)
export class BanUserByIdByIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(){
    return
  }
}