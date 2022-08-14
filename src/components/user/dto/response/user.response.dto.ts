import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  qualityPointId: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
