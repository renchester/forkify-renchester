import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      let goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, no other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next', curPage);
    }

    // Last Page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton('previous', curPage);
    }

    // Other page
    if (curPage < numPages) {
      return (
        this._generateMarkupButton('previous', curPage) +
        this._generateMarkupButton('next', curPage)
      );
    }

    // Page 1, with other pages
    return '';
  }

  _generateMarkupButton(dir, curPage) {
    return `
    <button data-goto="${
      dir === 'next' ? curPage + 1 : curPage - 1
    }" class="btn--inline pagination__${
      dir === 'next' ? 'btn--next' : 'btn--prev'
    }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${
      dir === 'next' ? 'right' : 'left'
    }"></use>
      </svg>
      <span>Page ${dir === 'next' ? curPage + 1 : curPage - 1}</span>
    </button>`;
  }
}

export default new paginationView();
