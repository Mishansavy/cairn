import "./Pagination.css";

interface PaginationProps {
  page: number;
  pageCount: number;
  firstItem: number;
  lastItem: number;
  totalItems: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, firstItem, lastItem, totalItems, onChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Routes pages">
      <p className="pagination__range">
        {firstItem} to {lastItem} of {totalItems}
      </p>
      <div className="pagination__controls">
        <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <span className="pagination__position">
          Page {page} of {pageCount}
        </span>
        <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </nav>
  );
}
