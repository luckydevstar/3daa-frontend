import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Text } from 'app/intl';

class Pagination extends Component {
  handlePageChange(page) {
    return this.props.onPageChange(page.selected + 1);
  }

  render() {
    const pagesLength = Math.ceil(
      this.props.itemsLength / this.props.itemsPerPage
    );
    const { maxPagesDisplayed, forcePage, initialPage } = this.props;

    const previousLabel = <Text iKey="previous" />;
    const nextLabel = <Text iKey="next" />;
    return pagesLength > 1 ? (
      <nav
        className={`pagination-container pagination is-centered ${
          this.props.className
        }`}
      >
        <ReactPaginate
          pageCount={pagesLength}
          pageRangeDisplayed={maxPagesDisplayed}
          marginPagesDisplayed={0}
          pageClassName="button"
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          activeClassName="is-active"
          containerClassName="pagination"
          nextClassName="button p-l-20 p-r-20"
          previousClassName="button p-l-20 p-r-20"
          disabledClassName="is-disabled"
          previousLinkClassName="prev"
          nextLinkClassName="next"
          forcePage={forcePage}
          initialPage={initialPage}
          onPageChange={page => this.handlePageChange(page)}
        />
      </nav>
    ) : null;
  }
}

Pagination.defaultProps = {
  maxPagesDisplayed: 5,
  itemsPerPage: 8,
  forcePage: 0,
  className: ''
};

Pagination.propTypes = {
  itemsLength: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  maxPagesDisplayed: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  forcePage: PropTypes.number,
  className: PropTypes.string
};

export default Pagination;
