import View from './View.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data
      .map(recipe => {
        const id = window.location.hash.slice(1);

        return `<li class="preview">
                <a class="preview__link ${
                  id === recipe.id ? 'preview__link--active' : ''
                }" href="#${recipe.id}">
                <figure class="preview__fig">
                    <img src="${recipe.image}" alt="${recipe.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${recipe.title}</h4>
                    <p class="preview__publisher">${recipe.publisher}</p>
                </div>
                </a>
            </li>`;
      })
      .join(''); // combining the markups to a single text data
  }
}

export default new BookmarksView();
