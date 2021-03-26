import * as model from './model.js'; // model
import recipeView from './views/recipeView.js'; // view
import searchView from './views/searchView.js'; // search
import resultsView from './views/resultsView.js'; // search results
import paginationView from './views/paginationView.js'; // pagination
import bookmarksView from './views/bookmarksView.js'; // bookmarks

import 'core-js/stable'; // Polyfiling ES6
import 'regenerator-runtime/runtime'; // Polyfiling Async-Await

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Fetching Recipe from the API
    await model.loadRecipe(id);
    //            const { recipe } = model.state;

    // Rendering the Recipe
    recipeView.render(model.state.recipe);
    //            const recipeView = new RecipeView(model.state.recipe)
  } catch (err) {
    console.error(`${err}: ${err.message}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Getting search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Rendering search results
    // resultsView.render(model.state.search.result); // all results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Rendering NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  //              recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Adding/Removing bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Updating recipe view
  recipeView.update(model.state.recipe);

  // Rendering the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
