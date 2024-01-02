import * as model from './model.js';
import recipeView from './views/recipeView.js'; // recipeView will be the object created in the view
import 'core-js/stable'; // polifill latest js feature
import 'regenerator-runtime/runtime'; // polifill async await

const recipeContainer = document.querySelector('.recipe');

// Function that displays recipe inside the container.
async function controlRecipe() {
  try {
    const recipeId = window.location.hash.slice(1); // getting hash from the url (if the url is localhost:3000/#1234)
    // then hash value will be #1234

    if (!recipeId) return;

    // displaying spinner (once the data is loaded we will clear the container and attach data)
    recipeView.renderSpinner();

    //  calling function to fetch data from recipe details
    await model.loadRecipe(recipeId);

    // Rendering recipe details using view
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err.message);
  }
}

// controlRecipe();

// listening for hash change event in the url
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// improved event listener
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipe)
);
