import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';

export class PaginationMetadata {
  @ApiProperty({ name: 'current_page', example: 1 })
  @IsInt()
  current_page: number;

  @ApiProperty({ name: 'per_page', example: 1 })
  @IsInt()
  per_page: number;

  @ApiProperty({ name: 'prev_page', example: 1 })
  @IsNullOrType('number')
  prev_page: number | null;

  @ApiProperty({ name: 'next_page', example: 1 })
  @IsNullOrType('number')
  next_page: number | null;

  @ApiProperty({ name: 'page', example: 1 })
  @IsInt()
  last_page: number;

  @ApiProperty({ name: 'total', example: 1 })
  @IsInt()
  total: number;

  @ApiProperty({ name: 'search', example: 'Name' })
  @IsNullOrType('string')
  search: string | null;
}

export class PaginationResponse<TModel> {
  data: TModel[];
  @ApiProperty()
  meta: PaginationMetadata;
}
