import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWT {
    constructor(
      private jwtService: JwtService
    ){}

    verify(token: string){
        return this.jwtService.verify(token, {secret: 'secret'})
    }
    
}