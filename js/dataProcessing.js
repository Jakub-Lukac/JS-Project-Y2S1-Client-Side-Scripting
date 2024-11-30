import { selectedTypes, selectedWeightClass } from "./app.js";

// Process individual Pokemon data
export async function ProcessPokemonData(pokemonData) {
  const types = pokemonData.types.map((t) => t.type.name);
  const primaryType = types[0];
  const weight = pokemonData.weight;

  const typeMatches =
    selectedTypes.length === 0 || selectedTypes.includes(primaryType);

  // if the selectedTypes.length === 0 (no filters) - true
  // then selectedTypes.includes(primaryType) - false
  // overall - true
  // if (!typeMatches... - !typeMatches = false, hence we wont skip the pokemon

  // if the selectedTypes.length === 0 (we have filters) - false
  // then we have some filters (THEY DONT MATCH FOR INSTANCE)
  // then selectedTypes.includes(primaryType) - false
  // overall - false
  // if (!typeMatches... - !typeMatches = true, hence WE SKIP the pokemon

  // if the selectedTypes.length === 0 (we have filters) - false
  // then we have some filters (THEY DO MATCH FOR INSTANCE)
  // then selectedTypes.includes(primaryType) - true
  // overall - true
  // if (!typeMatches... - !typeMatches = false, hence we wont skip the pokemon

  const weightMatches =
    selectedWeightClass === "all" ||
    (selectedWeightClass === "0-100" && weight > 0 && weight < 100) ||
    (selectedWeightClass === "100-500" && weight >= 100 && weight < 500) ||
    (selectedWeightClass === "500+" && weight >= 500);

  if (!typeMatches || !weightMatches) {
    return null; // Skip Pokemon that does not match filters
  }

  // if the selectedWeightClass === "all" - true
  // all the other ones are - false
  // overall - true
  // if (!weightMatches... - !weightMatches = false, hence we wont skip the pokemon

  // if the selectedWeightClass === "0-100" and the pokemon weight is within range - true
  // all the other ones are - false
  // overall - true
  // if (!weightMatches... - !weightMatches = false, hence we wont skip the pokemon

  // if the selectedWeightClass === "0-100" and the pokemon weight is NOT within range - false
  // all the other ones are - false
  // overall - false
  // if (!weightMatches... - !weightMatches = true, hence we skip the pokemon

  // ************************************************************
  // THE SAME APPROACH APPLIES TO THE REMAINING CASES AS WELL
  // ************************************************************

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

  // Fetch additional details
  const abilityDescriptions = await FetchAbilityDetails(
    abilities.map((ability) => ability.url)
  );
  const locationNames = await FetchLocationNames(locationURL);

  return {
    name: pokemonName,
    abilitiesNames: abilities.map((a) => a.name),
    abilitiesShortDescriptions: abilityDescriptions,
    typesNames: types,
    locationNames: locationNames,
    weight: weight,
  };
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
