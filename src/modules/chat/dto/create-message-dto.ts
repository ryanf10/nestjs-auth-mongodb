import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;
}
