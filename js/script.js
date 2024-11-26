const POKEMON_URI = "https://pokeapi.co/api/v2/pokemon/";
let listOfPokemonDetailsUrls = []; // global variable
let listOfPokemonObjects = []; // global variable

// Once the content is loaded fire the fetchPokemonData function
document.addEventListener("DOMContentLoaded", () => {
  fetchPokemonData();
});

// Fetches the initial Pokémon data
async function fetchPokemonData() {
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

    console.log(listOfPokemonObjects);
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
