import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, passwordConfirm: string, firstName: string, lastName: string) {
    if(password != passwordConfirm){
        throw new BadRequestException(`Passwords do not match.`);
    }
    
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      throw new BadRequestException(`${username} is already taken`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { password: pw, ...savedUser } = await this.usersRepository.save({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      picture: '',
      resetToken: ''
    });

    return savedUser;
  }

  async login(user: User, response: Response) {
      const payload: JwtPayloadDto = { username: user.username, sub: user.id };
      // eslint-disable-next-line @typescript-eslint/camelcase
      const access_token =  this.jwtService.sign(payload);
      response.cookie('jwt', access_token);
      return access_token;
  }

  async validateUser(username: string, password: string) {

     const user = await this.usersRepository.findOne(
        { username },
        { select: ['id', 'username', 'password'] },
    );  

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password is not correct');
    }

    delete user.password;

    return user;
  }

  async userId(request:Request): Promise<number>{
    let cookie;
    
    try{
        cookie = request.cookies['jwt'];
    }
    catch(err){
        cookie = request.headers.cookie
    }

    try{
        const data = await this.jwtService.verify(cookie, {secret: process.env.JWT_SECRET});
        return data['sub'];
    }
    catch(err){
        return -1
    }    
  }

  async generateToken(user:User): Promise<string>{
    const payload: JwtPayloadDto = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }   
}
