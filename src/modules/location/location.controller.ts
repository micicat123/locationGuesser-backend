import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locaion')
export class LocationController {
    constructor( 
        private locationService: LocationService
    ){ }


}
