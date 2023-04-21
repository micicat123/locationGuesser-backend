import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModulesService } from 'src/common/common-modules/common-modules.service';
import { Guess } from 'src/entities/guess.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends CommonModulesService{
    constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>
    ){
        super(userRepository);
    }

    async getPersonalBest(id:number): Promise<any>{        
        const take = 4;
        const [data] =  await this.guessRepository.findAndCount({
            take,
            where: {
                user:{
                    id
                }
            },
            order: {
                errorDistance: 'ASC'
            },
            relations:['user']
        });
        return data;
    }
}
