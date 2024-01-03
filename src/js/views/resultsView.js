import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    return this._data
      .map(
        recipe => `
            <li class="preview">
                <a class="preview__link" href="#${recipe.id}">
                <figure class="preview__fig">
                    <img src="${recipe.image}" alt="${recipe.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${recipe.title}</h4>
                    <p class="preview__publisher">${recipe.publisher}</p>
                </div>
                </a>
            </li>`
      )
      .join(''); // combining the markups to a single text data
  }
}

export default new ResultsView();
