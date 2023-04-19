import { Controller, Get } from '@nestjs/common';
import { LocationService } from './locaion.service';

@Controller('locaion')
export class LocaionController {
    constructor( 
        private locationService: LocationService
    ){ }

    @Get('/most-upvoted/:page')
    async upvotedQuotes(@Param('page') page: number){
        return this.quoteService.paginateUpvoted(page);
    }
}
