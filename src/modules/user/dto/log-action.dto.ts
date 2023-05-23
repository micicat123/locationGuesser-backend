import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogActionDto {
  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  component: string | null;

  @ApiProperty()
  newValue: string | null;

  @ApiProperty()
  @IsString()
  URL: string;
}
