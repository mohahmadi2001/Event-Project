import { PaginationControl } from "react-bootstrap-pagination-control";

export function Paginate({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
}) {
  return (
    <PaginationControl
      page={currentPage}
      between={4}
      total={totalItems}
      limit={itemsPerPage}
      changePage={handlePageChange}
      ellipsis={4}
    />
  );
}
