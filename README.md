# JS-Project-Y2S1-Client-Side-Scripting

# Project Overview

This project is a **JavaScript-based web application that fetches Pokémon data from the PokéAPI and displays it dynamically in the browser**. The application allows users to filter Pokémon by type using checkboxes and displays detailed Pokémon information such as abilities, types, and encounter locations in a visually appealing card format.

# Technologies Used

- JavaScript (ES6+): For all functionality, including DOM manipulation, API requests, and data processing.
- HTML: Structure of the web application.
- CSS: Styling of dynamically created elements, including gradients for Pokémon types.
- PokéAPI: A RESTful API for accessing Pokémon data.
- Modern Browser Environment: Support for ES6 modules.

# File Descriptions

1.  **app.js**

    This file serves as the entry point of the application. It initializes the **main functionality, sets up event listeners, and coordinates the workflow between different modules.**

    - Key Functionalities:

      - Global Variables:

        - selectedTypes: Stores the Pokémon types selected by the user for filtering.
        - listOfPokemonObjects: Contains the fetched and processed Pokémon objects.

      - DOM Manipulation:

        - Creates and appends main containers to the **#mainDiv**.

      - Event Listener:

        - Listens for the **"DOMContentLoaded"** event to initialize the app.
        - Responds to the **"Start Fetching Data"** button click by invoking data fetching and displaying functions.

      - Integration:

        - Coordinates the functions from **ui.js, api.js, and filters.js** to fetch, process, and display Pokémon data.

2.  **api.js**

    Handles all API-related operations, including fetching Pokémon data, their abilities, and encounter locations.

    - Key Functionalities:

      - Fetching Pokémon Data:

        - Uses the **POKEMON_URI** endpoint to fetch a list of Pokémon.
        - Extracts detailed Pokémon URLs for further processing.

      - Fetching Pokémon Details:

        - Fetches individual Pokémon details (name, abilities, types, etc.).
        - Utilizes **ProcessPokemonData from dataProcessing.js** to structure and filter data.

      - Error Handling:
        Logs errors during API calls and ensures the application doesn't crash on failures.

3.  **filters.js**

    Defines **constants** and functions for filtering Pokémon based on their types.

    - Key Functionalities:

      - Constants:

        - typeGradients: **Maps Pokémon types to their respective gradient styles for visual representation.**
        - API_FILTERS: Defines the **offset** and **limit** for Pokémon fetching from the **API**.

      - Filtering Logic:

        - GetFilters: Reads user-selected checkboxes to determine the Pokémon types to filter.

4.  **dataProcessing.js**

    Processes raw Pokémon data fetched from the API and structures it into usable objects.

    - Key Functionalities:

      - Processing Pokémon Data:

        - Filters Pokémon based on the user-selected types (selectedTypes from app.js).
        - Extracts and structures data such as Pokémon names, abilities, types, and encounter locations.

      - Fetching Additional Data:

        - Retrieves **English descriptions** of Pokémon abilities.
        - Fetches Pokémon encounter locations using a separate API endpoint.

      - Error Handling:

        - Ensures data integrity and **provides fallbacks when certain data (e.g., locations) is unavailable.**

5.  **ui.js**

    Handles all **DOM-related tasks**, including displaying Pokémon data and visual elements.

    - Key Functionalities:

      - Loading Spinner:

        - **showLoadingSpinner and hideLoadingSpinner: Display and hide a loading indicator during data fetching.**

      - Display Functions:

        - DisplayLogo: Adds the Pokémon logo to the page.
        - DisplayInputFields: Dynamically generates type filter checkboxes and the **"Start Fetching Data"** button.
        - DisplayPokemonCard: Creates and appends Pokémon cards with detailed information (abilities, types, locations) to the page.

# Interconnection Between Files

## Main Workflow:

1. Initialization **(app.js)**:

   Sets up the main container and event listeners.
   Coordinates the invocation of **filtering, data fetching, and displaying functions.**

2. Filtering **(filters.js)**:

   Reads **user-selected checkboxes** and returns the selected types to app.js.

3. Data Fetching **(api.js)**:

   Fetches the **list of Pokémon** and their detailed data.
   Delegates processing to dataProcessing.js.

4. Data Processing **(dataProcessing.js)**:

   **Filters** and structures data based on the selected Pokémon types **(selectedTypes from app.js)**.
   Retrieves additional details (abilities and locations) for each Pokémon.

5. UI Rendering **(ui.js)**:

   Displays the Pokémon logo and type filters.
   **Dynamically generates** Pokémon cards using the processed data (listOfPokemonObjects from app.js).

# How to Run the Project

1. **Clone or download** the repository to your local machine.
2. Ensure your system supports ES6 modules (**modern browsers** like Chrome, Edge, or Firefox).
3. **Host** the project using a local server (e.g., VS Code Live Server)
4. Open the **index.html** file in your browser.
5. Interact with the app:
6. Select Pokémon types using **checkboxes**.
7. Click **"Start Fetching Data"** to fetch and display filtered Pokémon.
