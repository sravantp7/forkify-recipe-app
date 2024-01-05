import * as model from './model.js';

import recipeView from './views/recipeView.js'; // recipeView will be the object created in the view
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polifill latest js feature
import 'regenerator-runtime/runtime'; // polifill async await

// parcel settings to persist data even when we reload the dev server
// if (module.hot) {
//   module.hot.accept();
// }

// Function that displays recipe inside the container.
async function controlRecipe() {
  try {
    const recipeId = window.location.hash.slice(1); // getting hash from the url (if the url is localhost:3000/#1234)
    // then hash value will be #1234

    if (!recipeId) return;

    // displaying spinner (once the data is loaded we will clear the container and attach data)
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    // calling function to fetch data from recipe details
    await model.loadRecipe(recipeId);

    // Rendering recipe details using view
    recipeView.render(model.state.recipe);

    if (model.state.bookmarks.length > 0) {
      bookmarksView.render(model.state.bookmarks);
    }
  } catch (err) {
    // invoking render error method in the recipe view
    recipeView.renderError();
  }
}

// function that fetches recipes
async function controlSearchResults() {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err.message);
  }
}

function controlPagination(page) {
  // loading the search results for the given page number and
  // rendering it on the screen
  resultsView.render(model.getSearchResultsPage(page));
  // rendering pagination button based on current page
  paginationView.render(model.state.search);
}

function controlServings(newServingS) {
  model.updateServings(newServingS);
  // update the recipe page
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  // deleting bookmark if it is already bookmarked
  else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }

  bookmarksView.render(model.state.bookmarks);
  // re-rendering the view after updating the state
  recipeView.update(model.state.recipe);
}

export async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // rendering the new recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage('Successfully uploaded the new recipe');
    // closing the form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
