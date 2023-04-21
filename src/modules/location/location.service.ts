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

    async getLatestLocations(page:number): Promise<any>{        
        const take = 9;
        const [data, total] =  await this.locationRepository.findAndCount({
            take,
            skip: take * (page - 1),
            order: {
                createdAt: 'DESC'
            }
        });
        return data;
    }

    async getRandomLocation(): Promise<any>{        
        const locations = await this.locationRepository.find();
    
        return locations[Math.floor(Math.random() * locations.length)];
    }

    async getLocationLeaderboard(id:number): Promise<any>{        
        const take = 12;
        const [data] =  await this.guessRepository.findAndCount({
            take,
            where: {
                location:{
                    id
                }
            },
            order: {
                errorDistance: 'ASC'
            },
            relations:['location']
        });
        return data;
    }

    async getUsersLocations(id:number): Promise<any>{        
        const take = 4;
        const [data] =  await this.locationRepository.findAndCount({
            take,
            where: {
                user:{
                    id
                }
            },
            order: {
                createdAt: 'DESC'
            },
            relations:['user']
        });
        return data;
    }
    
}