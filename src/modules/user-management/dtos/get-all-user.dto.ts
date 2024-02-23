import { PaginationDto } from '../../../core/builder/pagination.dto';

export class GetAllUserDto extends PaginationDto {
  role?: string | null;
}
