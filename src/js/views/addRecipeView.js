import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', e => {
      // open the add recipe page
      this._overlay.classList.remove('hidden');
      this._window.classList.remove('hidden');
    });
    this._btnClose.addEventListener('click', e => {
      // close the recipe page when clicking on the close button
      this._overlay.classList.add('hidden');
      this._window.classList.add('hidden');
    });
    this._overlay.addEventListener('click', e => {
      // close the add recipe page when clicking outside
      this._overlay.classList.add('hidden');
      this._window.classList.add('hidden');
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.stopPropagation();

      // getting data from the form, take the form element as the param (this._parentElement is the form element)
      const dataArr = [...new FormData(this._parentElement)];

      // Object.fromEntries(dataArr) -> converts array of entries to object
      handler(Object.fromEntries(dataArr));
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
