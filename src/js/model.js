import { FORKIFY_API, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

// gobal state which holds the data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
};

// function that fetches data from forkify api
export async function loadRecipe(recipeId) {
  try {
    const data = await getJSON(`${FORKIFY_API}/${recipeId}`);

    const { recipe } = data.data;

    // modifying state object
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
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
