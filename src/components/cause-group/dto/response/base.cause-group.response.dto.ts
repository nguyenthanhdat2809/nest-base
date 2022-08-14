import { Expose } from 'class-transformer';

export class BaseCauseGroupResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
