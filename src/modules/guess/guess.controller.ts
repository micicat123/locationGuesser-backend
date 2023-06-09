import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { GuessService } from './guess.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('guess')
export class GuessController {
  constructor(
    private guessService: GuessService,
    private authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:lId/:distance')
  async guessTheLocation(
    @Param('lId') lId: number,
    @Param('distance') distance: number,
    @Req() request: Request,
  ) {
    const uid: number = await this.authService.userId(request);
    if (uid == -1)
      return {
        success: false,
        message: `token isn't valid`,
      };
    await this.guessService.isAllowed(uid, lId);

    return await this.guessService.create({
      errorDistance: distance,
      user: uid,
      location: lId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:lId')
  async getGuesses(@Param('lId') lId: number) {
    return await this.guessService.getGuesses(lId);
  }
}
