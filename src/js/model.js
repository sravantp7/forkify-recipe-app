import { FORKIFY_API } from './config.js';
import { getJSON } from './helpers.js';

// gobal state which holds the data
export const state = {
  recipe: {},
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
    console.error(err.message);
  }
}
