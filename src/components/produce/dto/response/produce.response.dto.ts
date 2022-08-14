import { Expose } from 'class-transformer';

export class ProduceResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
