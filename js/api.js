import { API_FILTERS } from "./filters.js";

import { ProcessPokemonData } from "./dataProcessing.js";

// As I have previously worked with APIs I gathered some knowledge about them
// reponse for https://pokeapi.co/api/v2/pokemon/ , holds next page url
// I could have done that it should repeat the fetching until it fetches all the pokemons
// however for learning purposes I just set the offset and limit
// so I start from the first pokemon and I retrieve 50 of them
// these values can be easily changed

const POKEMON_URI = `https://pokeapi.co/api/v2/pokemon/?offset=${API_FILTERS.offset}&limit=${API_FILTERS.limit}`;

/*******************************************************************************************************************/
//                           FETCHING POKEMON DATA (POKEMONS, DETAILS, ABILITIES, LOCATION)
/*******************************************************************************************************************/

let listOfPokemonDetailsUrls = [];
let listOfPokemonObjects = [];

// Fetches the initial Pokémon data
export async function FetchPokemonData() {
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

    return listOfPokemonObjects;
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
