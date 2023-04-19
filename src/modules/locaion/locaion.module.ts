import { Module } from '@nestjs/common';
import { LocaionService } from './locaion.service';
import { LocaionController } from './locaion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';
import { Location } from 'src/entities/location.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Guess, Location])],
    providers: [LocaionService, TypeOrmModule],
    controllers: [LocaionController]
})
export class LocaionModule {}
  
