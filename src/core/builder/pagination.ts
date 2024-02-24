import { QueryWithHelpers, Document } from 'mongoose';
import { PaginationDto } from './pagination.dto';

export const PaginationBuilder = async <T>(
  query: QueryWithHelpers<T, Document>,
  arrayFieldName: string,
  { page, page_size, sort_name, sort_type, keyword }: PaginationDto,
) => {
  const sort = {};
  if (sort_name) {
    sort_type = sort_type || 'asc';
    sort[sort_name] = sort_type;
  }

  const data = await query
    .clone()
    .collation({ locale: 'en' }) // for case insensitive
    .sort(sort)
    .skip(page_size * (page - 1))
    .limit(page_size);
  const total = await query.clone().countDocuments().exec();
  const result = {
    total: total,
    page: page ? (Number(page) > 0 ? Number(page) : 1) : 1,
    page_size: page_size
      ? Number(page_size) > 0
        ? Number(page_size)
        : total
      : total,
    keyword: keyword && keyword.length > 0 ? keyword : undefined,
    sort_name: sort_name && sort_name.length > 0 ? sort_name : undefined,
    sort_type: sort_name ? sort_type : undefined,
  };
  result[arrayFieldName] = data;
  return result;
};
