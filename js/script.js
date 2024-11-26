const POKEMON_URI = "https://pokeapi.co/api/v2/pokemon/";
let listOfPokemonDetailsUrls = [];
let listOfPokemonObjects = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchPokemonData();
});

// Fetches the initial Pokémon data
async function fetchPokemonData() {
  try {
    const response = await fetch(POKEMON_URI);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const pokemons = data.results;

    // For each pokemon, extract the url property and include it in the new array list
    listOfPokemonDetailsUrls = pokemons.map((pokemon) => pokemon.url);

    listOfPokemonObjects = await fetchPokemonDetails(listOfPokemonDetailsUrls);

    console.log(listOfPokemonObjects);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Fetch detailed Pokémon information
async function fetchPokemonDetails(urls) {
  const pokemonObjects = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const pokemonData = await response.json();
      const pokemon = await processPokemonData(pokemonData);

      pokemonObjects.push(pokemon);
    } catch (error) {
      console.error(error);
    }
  }

  return pokemonObjects;
}

// Process individual Pokémon data
async function processPokemonData(pokemonData) {
  const pokemonName = pokemonData.name;
  const abilities = pokemonData.abilities.map((a) => a.ability);
  const types = pokemonData.types.map((t) => t.type.name);
  const locationURL = pokemonData.location_area_encounters;

  const abilityDescriptions = await fetchAbilityDetails(
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
async function fetchAbilityDetails(urls) {
  const descriptions = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const abilityData = await response.json();
      const englishEntry = abilityData.effect_entries.find(
        (entry) => entry.language.name === "en"
      );

      // if the englishEntry exists, push the englishEntry.short_effect to the descriptions lists, otherwise push empty string
      descriptions.push(englishEntry ? englishEntry.short_effect : "");
    } catch (error) {
      console.error(error);
      descriptions.push(""); // Add an empty string if the fetch fails
    }
  }

  return descriptions;
}

// Fetch Pokémon encounter locations
async function fetchLocationNames(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const locationData = await response.json();
    return locationData.map((location) => location.location_area.name);
  } catch (error) {
    console.error(error);
    return []; // Return an empty array if the fetch fails
  }
}
