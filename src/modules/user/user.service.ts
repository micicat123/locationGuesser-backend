import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModulesService } from 'src/common/common-modules/common-modules.service';
import { Log } from 'src/entities/Log.entity';
import { Guess } from 'src/entities/guess.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LogActionDto } from './dto/log-action.dto';

@Injectable()
export class UserService extends CommonModulesService{
    constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>,
        @InjectRepository(Log) private readonly logRepository: Repository<Log>
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

    async logAction(body:LogActionDto, id:User){
        return await this.logRepository.save({
            action: body.action,
            component: body.component,
            newValue: body.newValue,
            URL: body.URL,
            user: id
        });
    }

    async getLogs(){
        const take = 100;
        const [data] =  await this.logRepository.findAndCount({
            take,
            select:['createdAt', 'action', 'component', 'newValue', 'URL'],
            order: {
                createdAt: 'DESC'
            },
        });
        return data;
    }
}
