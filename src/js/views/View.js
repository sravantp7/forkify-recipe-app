import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received data to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @returns {undefined} Return no result
   * @this {Object} View instance
   */

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();

    // emptying the recipe container (removes spinner also)
    this._clear();

    // adding the recipe details to the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Method for clear the container
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // update the recipe detais without re-rendering the entire detais.
  update(data) {
    // if (!data || data.length === 0) {
    //   return this.renderError();
    // }

    this._data = data;
    const newMarkup = this._generateMarkup();

    // Converting html string data to dom objects
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // converting dom object to nodelist
    const newElements = Array.from(newDom.querySelectorAll('*'));

    // selecting the current dom values for the parent element
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newElm, i) => {
      const curElm = currentElements[i];

      if (
        !newElm.isEqualNode(curElm) &&
        newElm.firstChild?.nodeValue.trim() !== ''
      ) {
        curElm.textContent = newElm.textContent;
      }

      // updating attributes of current element to new elements attribute value only for elements which are different from current element
      if (!newElm.isEqualNode(curElm)) {
        Array.from(newElm.attributes).forEach(attr =>
          curElm.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderMessage(message = this._message) {
    const markup = `        
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
