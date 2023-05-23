import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { CommonModulesService } from '../../common/common-modules/common-modules.service';
import { Log } from '../../entities/Log.entity';
import { Guess } from '../../entities/guess.entity';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { LogActionDto } from './dto/log-action.dto';

@Injectable()
export class UserService extends CommonModulesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Guess)
    private readonly guessRepository: Repository<Guess>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
  ) {
    super(userRepository);
  }

  async getPersonalBest(id: number, take: number, page: number): Promise<any> {
    const [data, total] = await this.guessRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      where: {
        user: {
          id,
        },
      },
      order: {
        errorDistance: 'ASC',
      },
      relations: ['user', 'location'],
    });
    const totalPages = Math.ceil(total / take);
    const isLastPage = page == totalPages;

    return { data, isLastPage };
  }

  async logAction(body: LogActionDto, id: User) {
    return await this.logRepository.save({
      action: body.action,
      component: body.component,
      newValue: body.newValue,
      URL: body.URL,
      user: id,
    });
  }

  async getLogs() {
    const take = 100;
    const [data] = await this.logRepository.findAndCount({
      take,
      select: ['createdAt', 'action', 'component', 'newValue', 'URL'],
      order: {
        createdAt: 'DESC',
      },
    });
    return data;
  }

  async getGuesses(id: number) {
    return await this.guessRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      relations: ['user', 'location'],
    });
  }
}
