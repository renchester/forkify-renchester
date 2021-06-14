class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  // updateNavIcons() {
  //   console.log('NAV NAV');
  //   const navElement = Array.from(document.querySelectorAll('.nav__icon'));

  //   // navElement.map(nav => nav);
  //   // console.log(navElement.map(nav => nav.childNodes('.nav__icon')));

  //   console.log(navElement.forEach(nav => href));
  // }
}

export default new SearchView();
