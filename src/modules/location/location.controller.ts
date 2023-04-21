import { Body, Controller, Get, Param, Post, Put,Delete, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationCreateUpdateDto } from './dto/create-update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('location')
export class LocationController {
    constructor( 
        private locationService: LocationService,
        private authService: AuthService
    ){ }

    @Post()
    async createLocation(
        @Body() body: LocationCreateUpdateDto,
        @Req() request: Request
    ): Promise<Location>{
        const id = await this.authService.userId(request);
        return this.locationService.create({
            picture: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            latitude: body.latitude,
            longitude: body.longitude,
            user: id
        }); 
    }

    @Get()
    async getLocations(@Param('page') page: number) {
      return this.locationService.getLatestLocations(page); 
    }

    @Get('/random')
    async getRandomLocation() {
      return this.locationService.getRandomLocation(); 
    }

    @Get('/leaderboard/:id')
    async getLocationLeaderboard(@Param('id') id: number) {
      return this.locationService.getLocationLeaderboard(id); 
    }

    @Put('/:id')
    async updateLocation(
        @Body() body: LocationCreateUpdateDto,
        @Param('id') id: number
    ): Promise<Location>{
        return await this.locationService.create({
            id,
            latitude: body.latitude,
            longitude: body.longitude
        });
    }

    @Delete('/:id')
    async deleteQuote(@Param('id') id: number): Promise<Location>{
        return this.locationService.delete(id); 
    }

    @Get('/user')
    async getUsersLocations(@Req() request: Request) {
        const id = await this.authService.userId(request);
        return this.locationService.getUsersLocations(id);
    }
}
