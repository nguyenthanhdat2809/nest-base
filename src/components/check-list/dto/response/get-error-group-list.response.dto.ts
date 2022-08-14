import { Expose } from 'class-transformer';

export class GetErrorGroupListResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
