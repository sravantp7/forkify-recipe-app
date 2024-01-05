import { FORKIFY_API, RESULTS_PER_PAGE, API_KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

// gobal state which holds the data
export const state = {
  recipe: {}, // holds currently displaying recipe
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;

  // modifying state object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

// function that fetches data from forkify api
export async function loadRecipe(recipeId) {
  try {
    const data = await getJSON(`${FORKIFY_API}/${recipeId}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id == recipeId)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    // fetching data
    const recipesData = await getJSON(`${FORKIFY_API}?search=${query}`);

    if (recipesData.data.recipes.length === 0) {
      throw new Error('No recipies found, Please try again!');
    }

    // Renaming field in the result data
    state.search.results = recipesData.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });

    // resetting page on each new search
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

// function that will return data from the recipies array according to page number
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

// function that update the servings
export function updateServings(newServings) {
  state.recipe?.ingredients.forEach(ingredient => {
    // newQuantity = oldQuantity * newServings / oldServings
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

function storeBookmarks() {
  window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // adding new recipe to bookmarks
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  storeBookmarks();
}

export function deleteBookmark(id) {
  //  delete bookmark
  state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);

  if (state.recipe.id == id) {
    state.recipe.bookmarked = false;
  }

  storeBookmarks();
}

// function which upload new recipe to the API
export async function uploadRecipe(newRecipe) {
  try {
    // extracting required data  from the new recipe
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      // forming array off objects for ingredients as per the api
      .map(ing => {
        const ingData = ing[1].split(',');

        if (ingData.length !== 3) {
          throw new Error(
            'Wrong ingredient format, Please use the correct format'
          );
        }
        const [quantity, unit, description] = ingData;

        return {
          quantity: quantity === '' ? null : Number(quantity.trim()),
          unit: unit.trim(),
          description: description.trim(),
        };
      });

    // data that need to upload with the required property name
    newRecipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: Number(newRecipe.servings),
      cooking_time: Number(newRecipe.cookingTime),
      ingredients: ingredients,
    };

    // uploading new recipe data to the api
    const data = await sendJSON(`${FORKIFY_API}?key=${API_KEY}`, newRecipe);
    console.log(data);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}

function init() {
  const bookmarkedData = window.localStorage.getItem('bookmarks');
  if (bookmarkedData) {
    state.bookmarks = JSON.parse(bookmarkedData);
  }
}

init();
