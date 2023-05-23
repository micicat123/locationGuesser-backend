import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetUserPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @MinLength(6)
  @ApiProperty()
  @IsString()
  confirmNewPassword: string;
}
