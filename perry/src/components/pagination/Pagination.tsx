import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import ArrowRight from "../../assets/icons/arrow-right.svg?react";
import "./Pagination.scss";


interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination(props: PaginationProps) {
  const paginationClass = `pagination-container ${props.className || ""}`.trim();

  const getPageNumbers = () => {
    const pages = [];

    if (props.totalPages <= 7) {
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } 
    else {
      pages.push(1);

      if (props.currentPage > 4) {
        pages.push("...");
      }

      const start = Math.max(2, props.currentPage - 1);
      const end = Math.min(props.totalPages - 1, props.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (props.currentPage < props.totalPages - 3) {
        pages.push("...");
      } 

      pages.push(props.totalPages);
    }

    return pages;
  };

  return (
    <div className={paginationClass}>
      <button
        className="arrow-left-button"
        onClick={() => props.onPageChange(props.currentPage - 1)}
        disabled={props.currentPage === 1}
      >
        <ArrowLeft className="arrow-left-icon" />
      </button>

      {getPageNumbers().map((page, index) =>
        (typeof page === "number") ? (
          <button
            key={index}
            onClick={() => props.onPageChange(page)}
            className={page === props.currentPage ? "active-page-button" : "page-button"}
          >
            {page}
          </button>
        ) : (
          <div key={index} className="other-pages-container">
            {page}
          </div>
        )
      )}

      <button
        className="arrow-right-button"
        onClick={() => props.onPageChange(props.currentPage + 1)}
        disabled={props.currentPage === props.totalPages}
      >
        <ArrowRight className="arrow-right-icon" />
      </button>
    </div>
  );
}

export default Pagination;