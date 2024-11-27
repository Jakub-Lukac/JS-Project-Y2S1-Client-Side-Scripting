/*******************************************************************************************************************/
//   ORIGINAL FILE
//   FROM THIS FILE I DID LOT OF REFACTORING, MAINLY TRYING TO CREATE STANDALONE FILES
//   WHICH CLEARLY DESCRIBE SOME FEATURE OF THE OVERALL APP
/*******************************************************************************************************************/

// Define a map of Pokémon types to gradient styles
const typeGradients = {
  fire: "linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%)",
  water: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
  grass: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
  electric: "linear-gradient(120deg, #ffe259 0%, #ffa751 100%)",
  psychic: "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)",
  rock: "linear-gradient(120deg, #d7d2cc 0%, #304352 100%)",
  ice: "linear-gradient(120deg, #a6c9e2 0%, #c0d8e8 100%)",
  dragon: "linear-gradient(120deg, #00c6ff 0%, #0072ff 100%)",
  ghost: "linear-gradient(120deg, #6a4c93 0%, #d3d1e1 100%)",
  dark: "linear-gradient(120deg, #4b4b4b 0%, #2c2c2c 100%)",
  fairy: "linear-gradient(120deg, #f9d6f1 0%, #f8a1d5 100%)",
  bug: "linear-gradient(120deg, #7d9a92 0%, #5e7d44 100%)",
  normal: "linear-gradient(120deg, #a8a77d 0%, #c6d4ab 100%)",
  fighting: "linear-gradient(120deg, #d17a6e 0%, #d87e6b 100%)",
  flying: "linear-gradient(120deg, #a3b9e2 0%, #8a92c7 100%)",
  poison: "linear-gradient(120deg, #aa63a4 0%, #884b94 100%)",
  ground: "linear-gradient(120deg, #f4a261 0%, #e76f51 100%)",
  steel: "linear-gradient(120deg, #b8b8b8 0%, #4c4c4c 100%)",
  bug: "linear-gradient(120deg, #88b02b 0%, #7d9a92 100%)",
  default: "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)",
};

const offset = 0;
const limit = 500;

// As I have previously worked with APIs I gathered some knowledge about them
// reponse for https://pokeapi.co/api/v2/pokemon/ , holds next page url
// I could have done that it should repeat the fetching until it fetches all the pokemons
// however for learning purposes I just set the offset and limit
// so I start from the first pokemon and I retrieve 50 of them
// these values can be easily changed

/*******************************************************************************************************************/
//                                        VARIABLES AND ELEMENETS DECLARATION
/*******************************************************************************************************************/

const POKEMON_URI = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
let listOfPokemonDetailsUrls = []; // global variable
let listOfPokemonObjects = []; // global variable
let selectedTypes = [];

const app = document.getElementById("mainDiv");
const container = document.createElement("div");
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
          showLoadingSpinner(app);

          // get the filter from user input (checkboxes), only then start fetching data
          await GetFilters();

          await FetchPokemonData();
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

/*******************************************************************************************************************/
//                                       LOADNING SPINNER LOGIC
/*******************************************************************************************************************/

function showLoadingSpinner(container) {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingDiv";
  loadingDiv.classList.add("loading");

  const loadingImg = document.createElement("img");
  loadingImg.id = "loadingImg";
  loadingImg.src = "./images/loading.gif";

  loadingDiv.appendChild(loadingImg);
  container.appendChild(loadingDiv);
}

// Create a reusable function for hiding the loading spinner
function hideLoadingSpinner() {
  const loadingDiv = document.getElementById("loadingDiv");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

/*******************************************************************************************************************/
//                                        DISPLAYING LOGO AND CHECKBOXES
/*******************************************************************************************************************/

function DisplayLogo() {
  const logo = document.getElementById("logo");
  logo.src = "./images/logo.png";

  container.setAttribute("class", "container");
}

function DisplayInputFields() {
  const container = document.getElementById("inputContainer");

  const wrappersContainer = document.createElement("div");
  wrappersContainer.classList.add("wrappersContainer");

  // use for...of loop with the map object of typeGradients
  for (const [key, gradient] of Object.entries(typeGradients)) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    // Create the checkbox button
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "typeGradient"; // Same name for grouping so I can use ElementsGetByName later on
    checkBox.value = key; // The key of the map as the value (fire, grass, ...)
    checkBox.id = `cb-${key}`;

    // Create the label for the checkbox button
    const label = document.createElement("label");
    label.classList.add("checkBoxLabel");
    label.htmlFor = `cb-${key}`;

    // Capitalizing key for display
    label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    label.style.backgroundImage = gradient;

    // Append the checkbox button and label to the wrapper
    wrapper.appendChild(checkBox);
    wrapper.appendChild(label);

    // Append wrapper to the inputContainer (container)
    wrappersContainer.appendChild(wrapper);
  }

  container.appendChild(wrappersContainer);

  // Create button, when clicked, it will get all the filtered types
  const btn = document.createElement("button");
  btn.id = "filterBtn";
  btn.type = "button";
  btn.textContent = "Start Fetching Data";

  // Append the button to the container
  container.appendChild(btn);
}

/*******************************************************************************************************************/
//                                        FILTERS - GET USER INPUT (CHECKBOXES)
/*******************************************************************************************************************/

async function GetFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selectedTypes.push(checkboxes[i].value); // selectedTypes is global variable
    }
  }

  console.log(selectedTypes);
}

/*******************************************************************************************************************/
//                                             CREATING POKEMON CARDS
/*******************************************************************************************************************/

function DisplayPokemonCard() {
  console.log(selectedTypes);
  container.innerHTML = "";
  // clear innerHTML/ content of container which holds pokemon cards, every time DisplayPokemonCard() is called

  // when we use filter our list/array of pokemons may look like this:
  // 50() [null,null,null, {}, {}, {}, null, ...]
  // the null values are pokemons who do not match our selected filters
  // hence we need to filter those pokemons

  const validPokemonObjects = listOfPokemonObjects.filter(
    (pokemon) => pokemon !== null
  );

  console.log(validPokemonObjects);

  validPokemonObjects.forEach((pokemon) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    const h1 = document.createElement("h1");
    h1.textContent = pokemon.name;

    // Adjusting gradient color depending on the first (main) type of pokemon
    const gradient =
      typeGradients[pokemon.typesNames[0]] || typeGradients.default;
    h1.style.backgroundImage = gradient;

    /************************************************************************/
    //                          ABILITIES AND DESCRIPTION
    /************************************************************************/

    const listOfAbilities = pokemon.abilitiesNames;
    const listOfAbilitiesDescriptions = pokemon.abilitiesShortDescriptions;

    const abilitiesAndDescription = document.createElement("p");
    const abilitiesAndDescriptionStaticText = document.createElement("span");
    abilitiesAndDescriptionStaticText.textContent =
      "Abilities and Description : ";
    abilitiesAndDescriptionStaticText.classList.add("static-text");

    const abilitiesAndDescriptionDynamicText = document.createElement("ul");
    abilitiesAndDescriptionDynamicText.classList.add("dynamic-text");

    for (let index = 0; index < listOfAbilities.length; index++) {
      const listItem = document.createElement("li");
      const listItemContent = `${listOfAbilities[index]} (${listOfAbilitiesDescriptions[index]})`;
      listItem.textContent = listItemContent;
      abilitiesAndDescriptionDynamicText.appendChild(listItem);
    }

    abilitiesAndDescription.appendChild(abilitiesAndDescriptionStaticText);
    abilitiesAndDescription.appendChild(abilitiesAndDescriptionDynamicText);

    /************************************************************************/
    //                               TYPES
    /************************************************************************/

    const types = document.createElement("p");
    const typesStaticText = document.createElement("span");
    typesStaticText.textContent = "Types : ";
    typesStaticText.classList.add("static-text");

    const typesDynamicText = document.createElement("span");
    typesDynamicText.textContent = pokemon.typesNames.join(", ");
    typesDynamicText.classList.add("dynamic-text");
    types.append(typesStaticText, typesDynamicText);

    /************************************************************************/
    //                               LOCATIONS
    /************************************************************************/
    const locations = pokemon.locationNames;

    const encounterLocations = document.createElement("p");
    const locationsStaticText = document.createElement("span");
    locationsStaticText.textContent = "Encounter Locations : ";
    locationsStaticText.classList.add("static-text");

    const locationsDynamicText = document.createElement("ul");
    locationsDynamicText.classList.add("dynamic-text");

    // display max 4 locations
    for (let index = 0; index < 4; index++) {
      const listItem = document.createElement("li");
      const listItemContent = `${locations[index] ?? "N/A"}`; // N/A as the official endpoint does not contain any data for that location
      listItem.textContent = listItemContent;
      locationsDynamicText.appendChild(listItem);
    }

    encounterLocations.append(locationsStaticText);
    encounterLocations.appendChild(locationsDynamicText);

    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(abilitiesAndDescription);
    card.appendChild(types);
    card.appendChild(encounterLocations);
  });
}

/*******************************************************************************************************************/
//                           FETCHING POKEMON DATA (POKEMONS, DETAILS, ABILITIES, LOCATION)
/*******************************************************************************************************************/

// Fetches the initial Pokémon data
async function FetchPokemonData() {
  try {
    const response = await fetch(POKEMON_URI);
    if (!response.ok)
      throw new Error(
        `HTTP error! Status: ${response.status} - Status: ${response.status}`
      );

    const data = await response.json();
    const pokemons = data.results;

    // For each pokemon, extract the url property and include it in the new array list
    // map returns new list, without modifying the original list
    listOfPokemonDetailsUrls = pokemons.map((pokemon) => pokemon.url);

    // map simplifies the following process when using forEach (makes the code much cleaner and readable)
    /*let list = [];
    pokemons.forEach((pokemon) => {
      let POKEMON_DETAILS_URL = pokemon["url"];
      list.push(POKEMON_DETAILS_URL);
    });*/

    listOfPokemonObjects = await FetchPokemonDetails(listOfPokemonDetailsUrls);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Fetch detailed Pokémon information
async function FetchPokemonDetails(urls) {
  const pokemonObjects = [];

  // I had to do bit of a research and found out that I had to use for... of loop instead of for each loop
  // as for each loop like we saw in lectures executes a callback function on each element meaning I could not use await keyword
  // within the for each declaration
  // also I can use break and continue within for...of loop

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);

      const pokemonData = await response.json();
      const pokemon = await ProcessPokemonData(pokemonData);

      // push complete pokemon object to the list
      pokemonObjects.push(pokemon);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(pokemonObjects);

  return pokemonObjects;
}

// Process individual Pokemon data
async function ProcessPokemonData(pokemonData) {
  let fetchPokemon = true;
  // Fetching types as first parameter, because if the types do not match our filters we do not care about the pokemon
  const types = pokemonData.types.map((t) => t.type.name);

  // we only check the fisrt type (primary)
  const primaryType = types[0];

  if (selectedTypes.length > 0) {
    // we do not use .find() as it returns element, we only want true/false
    if (selectedTypes.includes(primaryType)) {
      // we want to display this pokemon
      fetchPokemon = true;
    } else {
      // we do not want to display this pokemon
      fetchPokemon = false;
    }
  }

  if (fetchPokemon) {
    const pokemonName = pokemonData.name;

    const abilities = pokemonData.abilities.map((a) => a.ability);
    // at this point the following is stored in the abilities variable :
    /*
      "ability": {
          "name": "overgrow",
          "url": "https://pokeapi.co/api/v2/ability/65/"
      },
      "ability": 
      {
          "name": "chlorophyll",
          "url": "https://pokeapi.co/api/v2/ability/34/"
      },
    */
    // this helps me to easily retrieve both name and url properties later on

    // original types structure :

    // - for each type (t) we access the type property and finally the name property, which we retrieve

    /*"types": [
          {
              "slot": 1,
              "type": {
                  "name": "grass",
                  "url": "https://pokeapi.co/api/v2/type/12/"
              }
          },
          {
              "slot": 2,
              "type": {
                  "name": "poison",
                  "url": "https://pokeapi.co/api/v2/type/4/"
              }
          }
      ],
    */

    const locationURL = pokemonData.location_area_encounters;

    const abilityDescriptions = await FetchAbilityDetails(
      // as input parameter we pass the list of urls of abilities
      // as mentioned previously, we can easily access the url property
      abilities.map((ability) => ability.url)
    );

    const locationNames = await FetchLocationNames(locationURL);

    return {
      name: pokemonName,
      abilitiesNames: abilities.map((a) => a.name),
      abilitiesShortDescriptions: abilityDescriptions,
      typesNames: types,
      locationNames,
    };
  } else {
    return null; // if we do not want to fetch the pokemon, return null
  }
}

// Fetch ability descriptions in English
// I noticed that some abilities description JSONs have different order of languages
// some have the de (deutsche) as first and en (english) as second and also other way around
// hence I can not just access [0] or [1] element as it may result into inconsistency of output (different languages)
async function FetchAbilityDetails(urls) {
  const descriptions = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);

      const abilityData = await response.json();
      const englishEntry = abilityData.effect_entries.find(
        (entry) => entry.language.name === "en"
      );

      // if the englishEntry exists, push the englishEntry.short_effect to the descriptions lists, otherwise push empty string
      descriptions.push(englishEntry ? englishEntry.short_effect : "");
    } catch (error) {
      console.error(error);
      descriptions.push(""); // Add empty string if the fetch fails
    }
  }

  return descriptions;
}

// Fetch Pokemon encounter locations
async function FetchLocationNames(url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);

    const locationData = await response.json();
    return locationData.map((location) => location.location_area.name);
  } catch (error) {
    console.error(error);
    return []; // Return an empty array if the fetch fails
  }
}
