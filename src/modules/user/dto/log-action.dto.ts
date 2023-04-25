import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class LogActionDto {

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  component: string;

  @ApiProperty()
  @IsString()
  newValue: string;

  @ApiProperty()
  @IsString()
  URL: string;
}