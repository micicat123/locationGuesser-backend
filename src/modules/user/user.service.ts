import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModulesService } from 'src/common/common-modules/common-modules.service';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends CommonModulesService{
    constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){
        super(userRepository);
    }
}
