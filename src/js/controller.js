// import external library: fractional
import { Fraction } from 'fractional';

// importing the model module
import * as model from './model.js';

import { MODAL_CLOSE_SEC } from './config.js';

// importing the first view
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import View from './views/View.js';

// for polyfilling async await
import 'regenerator-runtime/runtime';

// for polyfilling everything else
import 'core-js/stable';

// if (module.hot) {
//   module.hot.accept();
// }

// LOADING A RECIPE FROM THE API
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0 UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT
    resultsView.update(model.getSearchResultsPage());

    // 1 UPDATING BOOKMARKS VIEW
    bookmarksView.render(model.state.bookmarks);

    // 2 LOADING RECIPE - async function (returns a promise)
    await model.loadRecipe(id);

    // 3 RENDERING THE RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
controlRecipes();

const controlSearchResults = async function () {
  try {
    // 1 GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2 LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    // 3 RENDER RESULTS
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4 RENDER INITIAL PAGINATION
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1 RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2 RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1 Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2 Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1 ADD/REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2 UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // 3 RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0 Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // history API = changes URL without having to reload
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
  setTimeout(function () {
    location.reload();
  }, 1500);
};

// SUBSCRIBER
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
