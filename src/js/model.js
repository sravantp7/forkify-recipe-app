import { FORKIFY_API } from './config.js';
import { getJSON } from './helpers.js';

// gobal state which holds the data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
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
