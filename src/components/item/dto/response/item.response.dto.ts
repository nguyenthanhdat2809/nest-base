import { Expose } from 'class-transformer';

export class ItemResponseDto {
  @Expose()
  id: number;
}
