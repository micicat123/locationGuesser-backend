import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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