import { BadRequestException, Body, Get, Post, Param, Put, Req, UseGuards, Delete, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
    constructor( 
        private userService: UserService
    ){ }

}
