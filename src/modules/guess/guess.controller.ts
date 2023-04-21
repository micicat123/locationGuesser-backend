import { Controller, Param, Post, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { GuessService } from './guess.service';

@Controller('guess')
export class GuessController {
    constructor( 
        private guessService: GuessService,
        private authService:AuthService
    ){ }
    
    @Post('/:lId/:distance')
    async guessTheLocation(
        @Param('lId') lId: number,
        @Param('distance') distance: number,
        @Req() request: Request
    ){
        const uid:number = await this.authService.userId(request);
        await this.guessService.isAllowed(uid, lId);

        return await this.guessService.create({
            createdAt: new Date(),
            updatedAt: new Date(),
            errorDistance: distance,
            user: uid,
            location: lId
        });
    }

}
