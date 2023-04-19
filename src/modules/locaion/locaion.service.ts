import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModulesService } from 'src/common/common-modules/common-modules.service';
import { Guess } from 'src/entities/guess.entity';
import { Location } from 'src/entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService extends CommonModulesService{
    constructor( 
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
        @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>
    ){
        super(locationRepository);
    }

    
}