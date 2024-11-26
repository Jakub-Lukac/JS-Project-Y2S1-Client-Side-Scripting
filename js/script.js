const POKEMON_URI = "https://pokeapi.co/api/v2/pokemon/";
var listOfPokemonDetailsUrls = [];
var listOfPokemonObjects = [];

document.addEventListener("DOMContentLoaded", function () {
  fetchPokemonData();
});

async function fetchPokemonData() {
  const response = await fetch(POKEMON_URI);

  if (!response.ok) {
    throw new Error(`HTTP error! Status : ${response.status}`);
  }

  const data = await response.json();

  const pokemons = data["results"];

  listsOfPokemonDetailsUrls = await FetchDetailURLs(pokemons);

  await FetchPokemonDetails(listsOfPokemonDetailsUrls);
}

async function FetchDetailURLs(pokemons) {
  let list = [];
  pokemons.forEach((pokemon) => {
    let POKEMON_DETAILS_URL = pokemon["url"];
    list.push(POKEMON_DETAILS_URL);
  });

  return list;
}

async function FetchPokemonDetails(listOfPokemonDetailsUrls) {
  const pokemonObjects = [];

  for (const detailUrl of listOfPokemonDetailsUrls) {
    const response = await fetch(detailUrl);
    if (!response.ok) {
      console.error(`Failed to fetch ${detailUrl}: ${response.status}`);
      continue;
    }
    const pokemonData = await response.json();

    let pokemonName = pokemonData["name"];

    let pokemonAbilitiesNames = [];
    let pokemonAbilitiesDetailURLs = [];
    let pokemonAbilitiesShortDescriptions = [];
    let pokemonEncounterAreaURL;
    let pokemonLocationNames = [];

    pokemonData["abilities"].forEach((ability) => {
      pokemonAbilitiesNames.push(ability["ability"]["name"]);
    });

    pokemonData["abilities"].forEach((ability) => {
      pokemonAbilitiesDetailURLs.push(ability["ability"]["url"]);
    });

    pokemonAbilitiesShortDescriptions = await FetchAbilityDetails(
      pokemonAbilitiesDetailURLs
    );

    let PokemonTypesNames = [];
    pokemonData["types"].forEach((type) => {
      PokemonTypesNames.push(type["type"]["name"]);
    });

    pokemonEncounterAreaURL = pokemonData["location_area_encounters"];

    pokemonLocationNames = await FetchLocationsNames(pokemonEncounterAreaURL);

    const pokemon = {
      name: pokemonName,
      abilitiesNames: pokemonAbilitiesNames,
      abilitiesShortDescriptions: pokemonAbilitiesShortDescriptions,
      typesNames: PokemonTypesNames,
      locationNames: pokemonLocationNames,
    };

    pokemonObjects.push(pokemon);
  }

  console.log(pokemonObjects);

  //return pokemonDetails;
}

async function FetchLocationsNames(pokemonEncounterAreaURL) {
  const response = await fetch(pokemonEncounterAreaURL);

  if (!response.ok) {
    console.error(`Failed to fetch ${detailUrl}: ${response.status}`);
    return;
  }

  const pokemonAreaDetails = await response.json();

  let locationNames = [];

  pokemonAreaDetails.forEach((location) => {
    locationNames.push(location["location_area"]["name"]);
  });

  return locationNames;
}

async function FetchAbilityDetails(pokemonAbilitiesDetailURLs) {
  let listOfAbilityDescriptions = [];
  for (const abilityDetailUrl of pokemonAbilitiesDetailURLs) {
    const response = await fetch(abilityDetailUrl);

    if (!response.ok) {
      console.error(`Failed to fetch ${detailUrl}: ${response.status}`);
      continue;
    }

    const abilityData = await response.json();

    // fetch both languages as In some cases the first one is de, and second one is en, and other way around
    let abilityDescription = abilityData["effect_entries"];

    let englishAbilityShortDescription = "";

    // Find the English entry
    const englishEntry = abilityDescription.find(
      (entry) => entry["language"]["name"] === "en"
    );

    // If found, store the short_effect
    if (englishEntry) {
      englishAbilityShortDescription = englishEntry["short_effect"];
    }

    listOfAbilityDescriptions.push(englishAbilityShortDescription);
  }

  return listOfAbilityDescriptions;
}
