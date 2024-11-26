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
const limit = 50;

// As I have previously worked with APIs I gathered some knowledge about them
// reponse for https://pokeapi.co/api/v2/pokemon/ , holds next page url
// I could have done that it should repeat the fetching until it fetches all the pokemons
// however for learning purposes I just set the offset and limit
// so I start from the first pokemon and I retrieve 50 of them
// these values can be easily changed

const POKEMON_URI = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
let listOfPokemonDetailsUrls = []; // global variable
let listOfPokemonObjects = []; // global variable

const app = document.getElementById("mainDiv");
const container = document.createElement("div");
const div = document.createElement("div");
container.appendChild(div);

// Once the content is loaded fire the fetchPokemonData function
// async function as I have to wait to fetch data and only then display cards
document.addEventListener("DOMContentLoaded", async () => {
  await DisplayLogo();
  await FetchPokemonData();
  await DisplayPokemonCard();
});

function DisplayLogo() {
  const logo = document.createElement("img");
  logo.src = "./images/logo.png";

  container.setAttribute("class", "container");

  app.appendChild(logo);
  app.appendChild(container);
}

function DisplayPokemonCard() {
  div.style.display = "none";
  listOfPokemonObjects.forEach((pokemon) => {
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

// Fetches the initial Pokémon data
async function FetchPokemonData() {
  div.textContent = "Loading";

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

    listOfPokemonObjects = await fetchPokemonDetails(listOfPokemonDetailsUrls);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Fetch detailed Pokémon information
async function fetchPokemonDetails(urls) {
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
      const pokemon = await processPokemonData(pokemonData);

      // push complete pokemon object to the list
      pokemonObjects.push(pokemon);
    } catch (error) {
      console.error(error);
    }
  }

  return pokemonObjects;
}

// Process individual Pokemon data
async function processPokemonData(pokemonData) {
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

  const types = pokemonData.types.map((t) => t.type.name);

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

  const abilityDescriptions = await fetchAbilityDetails(
    // as input parameter we pass the list of urls of abilities
    // as mentioned previously, we can easily access the url property
    abilities.map((ability) => ability.url)
  );

  const locationNames = await fetchLocationNames(locationURL);

  return {
    name: pokemonName,
    abilitiesNames: abilities.map((a) => a.name),
    abilitiesShortDescriptions: abilityDescriptions,
    typesNames: types,
    locationNames,
  };
}

// Fetch ability descriptions in English
// I noticed that some abilities description JSONs have different order of languages
// some have the de (deutsche) as first and en (english) as second and also other way around
// hence I can not just access [0] or [1] element as it may result into inconsistency of output (different languages)
async function fetchAbilityDetails(urls) {
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
async function fetchLocationNames(url) {
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
