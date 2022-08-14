import { Expose } from 'class-transformer';

export class BaseUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  userName: string;
}
