import { Expose } from 'class-transformer';

export class GetItemUnitListResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
