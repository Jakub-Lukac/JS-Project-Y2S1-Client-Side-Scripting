import { typeGradients } from "./filters.js";

import { listOfPokemonObjects } from "./app.js";

/*******************************************************************************************************************/
//                                       LOADNING SPINNER LOGIC
/*******************************************************************************************************************/

export function showLoadingSpinner() {
  const app = document.getElementById("mainDiv");

  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingDiv";
  loadingDiv.classList.add("loading");

  const loadingImg = document.createElement("img");
  loadingImg.id = "loadingImg";
  loadingImg.src = "./images/loading.gif";

  loadingDiv.appendChild(loadingImg);
  app.appendChild(loadingDiv);
}

// Create a reusable function for hiding the loading spinner
export function hideLoadingSpinner() {
  const loadingDiv = document.getElementById("loadingDiv");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

/*******************************************************************************************************************/
//                                        DISPLAYING LOGO AND CHECKBOXES
/*******************************************************************************************************************/

export function DisplayLogo() {
  const logo = document.getElementById("logo");
  logo.src = "./images/logo.png";

  container.setAttribute("class", "container");
}

export function DisplayInputFields() {
  // CHECKBOXES
  const container = document.getElementById("inputContainer");

  const wrappersContainer = document.createElement("div");
  wrappersContainer.classList.add("wrappersContainer");

  // use for...of loop with the map object of typeGradients
  for (const [key, gradient] of Object.entries(typeGradients)) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    // Create the checkbox button
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "typeGradient"; // Same name for grouping so I can use ElementsGetByName later on
    checkBox.value = key; // The key of the map as the value (fire, grass, ...)
    checkBox.id = `cb-${key}`;

    // Create the label for the checkbox button
    const label = document.createElement("label");
    label.classList.add("checkBoxLabel");
    label.htmlFor = `cb-${key}`;

    // Capitalizing key for display
    label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    label.style.backgroundImage = gradient;

    // Appending checkbox to label and label to wrapper
    label.appendChild(checkBox);
    wrapper.appendChild(label);

    // Append wrapper to the inputContainer (container)
    wrappersContainer.appendChild(wrapper);
  }

  container.appendChild(wrappersContainer);

  // Dropdown for weight of pokemon

  const dropDownWrapper = document.createElement("div");
  dropDownWrapper.classList.add("dropdown-wrapper");

  const dropDownLabel = document.createElement("label");
  dropDownLabel.htmlFor = "weights";
  dropDownLabel.textContent = "Choose weight class of Pokémon:";

  const dropDownSelect = document.createElement("select");
  dropDownSelect.name = "weights";
  dropDownSelect.id = "weights";

  const allWeights = document.createElement("option");
  allWeights.value = "all";
  allWeights.textContent = "All Weights";

  const lightWeight = document.createElement("option");
  lightWeight.value = "0-100";
  lightWeight.textContent = "0-100";

  const middleWeight = document.createElement("option");
  middleWeight.value = "100-500";
  middleWeight.textContent = "100-500";

  const heavyWeight = document.createElement("option");
  heavyWeight.value = "500+";
  heavyWeight.textContent = "500+";

  dropDownSelect.append(allWeights, lightWeight, middleWeight, heavyWeight);
  dropDownWrapper.append(dropDownLabel, dropDownSelect);

  container.append(dropDownWrapper);

  // Create button, when clicked, it will get all the filtered types
  const btn = document.createElement("button");
  btn.id = "filterBtn";
  btn.type = "button";
  btn.textContent = "Start Fetching Data";

  // Append the button to the container
  container.appendChild(btn);
}

/*******************************************************************************************************************/
//                                             CREATING POKEMON CARDS
/*******************************************************************************************************************/

export function DisplayPokemonCard() {
  const container = document.getElementById("container");

  container.innerHTML = "";
  // clear innerHTML/ content of container which holds pokemon cards, every time DisplayPokemonCard() is called

  // when we use filter our list/array of pokemons may look like this:
  // 50() [null,null,null, {}, {}, {}, null, ...]
  // the null values are pokemons who do not match our selected filters
  // hence we need to filter those pokemons

  const validPokemonObjects = listOfPokemonObjects.filter(
    (pokemon) => pokemon !== null
  );

  console.log(validPokemonObjects);

  validPokemonObjects.forEach((pokemon) => {
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

    /************************************************************************/
    //                               WEIGHT
    /************************************************************************/

    const weight = document.createElement("p");
    const weightStaticText = document.createElement("span");
    weightStaticText.textContent = "Weight : ";
    weightStaticText.classList.add("static-text");

    const weightDynamicText = document.createElement("spna");
    weightDynamicText.textContent = pokemon.weight;
    weightDynamicText.classList.add("dynamic-text");

    weight.appendChild(weightStaticText);
    weight.appendChild(weightDynamicText);

    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(abilitiesAndDescription);
    card.appendChild(types);
    card.appendChild(encounterLocations);
    card.appendChild(weight);
  });
}
