const POKEMON_URI = "https://pokeapi.co/api/v2/pokemon/";

document.addEventListener("DOMContentLoaded", function () {
  fetchPokemonData();
});

async function fetchPokemonData() {
  const response = await fetch(POKEMON_URI);

  if (!response.ok) {
    throw new Error(`HTTP error! Status : ${response.status}`);
  }

  const pokemons = await response.json();

  console.log(pokemons);
}
