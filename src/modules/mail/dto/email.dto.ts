import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class EmailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  username: string;
}
