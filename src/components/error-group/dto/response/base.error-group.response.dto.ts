import { Expose } from 'class-transformer';

export class BaseErrorGroupResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
