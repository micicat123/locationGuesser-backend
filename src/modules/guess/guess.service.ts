import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModulesService } from '../../common/common-modules/common-modules.service';
import { Guess } from '../../entities/guess.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuessService extends CommonModulesService{
    constructor( 
        @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>
    ){
        super(guessRepository);
    }

    async isAllowed(uid:number, lid:number){        
        const guess = await this.guessRepository.find({
            where:{
                user:{
                    id: uid,
                },
                location:{
                    id: lid
                }
            },
            relations: ['user', 'location']
        });
        if (guess.length > 0) throw new BadRequestException(`You already guessed this location`);
    }
}
