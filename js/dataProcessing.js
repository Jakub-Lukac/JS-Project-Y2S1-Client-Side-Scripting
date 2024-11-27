import { selectedTypes } from "./app.js";

// Process individual Pokemon data
export async function ProcessPokemonData(pokemonData) {
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
