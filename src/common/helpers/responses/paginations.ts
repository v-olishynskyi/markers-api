import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';

export class PaginationMetadata {
  @ApiProperty({ name: 'page', example: 1 })
  @IsInt()
  page: number;

  @ApiProperty({ name: 'perPage', example: 1 })
  @IsInt()
  perPage: number;

  @ApiProperty({ name: 'prevPage', example: 1 })
  @IsNullOrType('number')
  prevPage: number | null;

  @ApiProperty({ name: 'nextPage', example: 1 })
  @IsNullOrType('number')
  nextPage: number | null;

  @ApiProperty({ name: 'page', example: 1 })
  @IsInt()
  lastPage: number;

  @ApiProperty({ name: 'total', example: 1 })
  @IsInt()
  total: number;
}

export class PaginationResponse<TModel> {
  data: TModel[];
  @ApiProperty()
  meta: PaginationMetadata;
}
