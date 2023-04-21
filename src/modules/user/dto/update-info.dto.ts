import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

}
