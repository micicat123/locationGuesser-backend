import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationCreateUpdateDto } from './dto/create-update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('location')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createLocation(
    @Body() body: LocationCreateUpdateDto,
    @Req() request: Request,
  ) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    return this.locationService.create({
      picture: '',
      latitude: body.latitude,
      longitude: body.longitude,
      user: id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/random-location')
  async getRandomLocation() {
    return this.locationService.getRandomLocation();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:page')
  async getUsersLocations(
    @Req() request: Request,
    @Param('page') page: number,
  ) {
    const id = await this.authService.userId(request);
    if (id == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    return this.locationService.getUsersLocations(id, page);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/leaderboard/:id')
  async getLocationLeaderboard(@Param('id') id: number) {
    return this.locationService.getLocationLeaderboard(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateLocation(
    @Body() body: LocationCreateUpdateDto,
    @Param('id') id: any,
  ): Promise<Location> {
    return await this.locationService.create({
      id: parseInt(id),
      latitude: body.latitude,
      longitude: body.longitude,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteQuote(@Param('id') id: number): Promise<Location> {
    await this.locationService.deleteGuessesForLocation(id);
    return this.locationService.delete(id);
  }

  @Get('/:page')
  async getLocations(@Param('page') page: number) {
    return await this.locationService.getLatestLocations(page);
  }
}
