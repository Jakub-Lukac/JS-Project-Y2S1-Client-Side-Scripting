export const typeGradients = {
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

export const API_FILTERS = {
  offset: 0,
  limit: 200,
};

//export const offset = 0;
//export const limit = 50;

/*******************************************************************************************************************/
//                                        FILTERS - GET USER INPUT (CHECKBOXES)
/*******************************************************************************************************************/

export async function GetSelectedTypes() {
  let selectedTypes = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selectedTypes.push(checkboxes[i].value); // selectedTypes is global variable
    }
  }

  console.log(selectedTypes);

  return selectedTypes;
}

export async function GetSelectedWeight() {
  const dropdown = document.getElementById("weights");
  const selectedValue = dropdown.value; // Gets the value of the selected option
  console.log(`Selected weight class: ${selectedValue}`); // Logs the selected value
  return selectedValue;
}
