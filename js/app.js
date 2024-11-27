import { GetFilters } from "./filters.js";

import {
  showLoadingSpinner,
  DisplayLogo,
  DisplayInputFields,
  hideLoadingSpinner,
  DisplayPokemonCard,
} from "./ui.js";

import { FetchPokemonData } from "./api.js";

/*******************************************************************************************************************/
//                                        VARIABLES AND ELEMENETS DECLARATION
/*******************************************************************************************************************/
export let selectedTypes = []; // global variable

export let listOfPokemonObjects = []; // global variable

const app = document.getElementById("mainDiv");
const container = document.createElement("div");
container.id = "container";
const inputContainer = document.createElement("div");
inputContainer.id = "inputContainer";
app.appendChild(inputContainer);
app.appendChild(container);

/*******************************************************************************************************************/
//                                            MAIN METHOD
/*******************************************************************************************************************/

// Once the content is loaded fire the fetchPokemonData function
// async function as I have to wait to fetch data and only then display cards
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await DisplayLogo();

    await DisplayInputFields();

    document.getElementById("filterBtn").addEventListener(
      "click",
      async () => {
        try {
          showLoadingSpinner();

          // get the filter from user input (checkboxes), only then start fetching data
          selectedTypes = await GetFilters();

          listOfPokemonObjects = await FetchPokemonData();
          // the cards (DOM elements) are creared in the memory
          // once we fetch all the data only then JS updates the DOM
          await DisplayPokemonCard();
        } finally {
          // Hide loading spinner once content is loaded
          hideLoadingSpinner();

          // once everything is done loading, we clear selected type, for next fetching
          selectedTypes = [];
        }
      },
      false
    );
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
});
