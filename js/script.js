const POKEMON_URI = "https://pokeapi.co/api/v2/pokemon/";
var listsOfPokemonDetailsUrls = [];

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

  console.log(listsOfPokemonDetailsUrls);
}

async function FetchDetailURLs(pokemons) {
  let list = [];
  pokemons.forEach((pokemon) => {
    let POKEMON_DETAILS_URL = pokemon["url"];
    list.push(POKEMON_DETAILS_URL);
  });

  return list;
}
