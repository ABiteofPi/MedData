
let selectedCityCallback = null;
let selectedCityCallback2 = null;

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}





function handleSelectedCityUpdate(selectedCity) {
  // Do something with the updatedCity value
  console.log("Selected City outside of D3 function:", selectedCity);

  // Check if a callback function is provided and call it
  if (selectedCityCallback) {
    selectedCityCallback(selectedCity);
  }
}


function handleUpdatechart(selectedCity2) {
  // Do something with the updatedCity value
  console.log("Selected City outside of D3 function 2:", selectedCity2);

  // Check if a callback function is provided and call it
  if (selectedCityCallback2) {
    selectedCityCallback2(selectedCity2);
  }
}


// Load your cities data from JSON file
d3.json("../Data/cities.json").then(function (data) {
  // Assuming the JSON structure is an array of objects with name, lat, and lng properties

  // Create a variable to store the selected city's latitude and longitude
  let selectedCity = { name: "", lat: 0, lng: 0 };
  let selectedCity2 = { name: "", lat: 0, lng: 0 };

  // Select the input field and search results container
  const searchInput = d3.select(".city-search");
  const searchResults = d3.select(".search-results");

// Function to update search results based on user input
  const updateSearchResults=debounce(function() {
    const searchTerm = searchInput.property("value").toLowerCase();

    // Reset the selectedCityCallback when the input is empty
    if (!searchTerm) {
      selectedCityCallback = null;
    }

    if (!searchTerm) {
      selectedCityCallback2 = null;
    }
    // Filter cities based on the input
    const filteredCities = searchTerm
      ? data.filter(city =>
          city.name.toLowerCase().includes(searchTerm)
        )
      : [];

    // Update the search results container
    const results = searchResults
      .selectAll("li")
      .data(filteredCities, d => d.name);

    // Remove old results
    results.exit().remove();

    // Add new results
    const newResults = results.enter()
      .append("li")
      .text(d => d.name)
      .on("click", function (d) {
        // When a city is selected, update the selectedCity variable
        selectedCity = { name: d.name, lat: d.lat, lng: d.lng };
        // Do whatever you want with the selected city data here
        console.log("Selected City:", selectedCity);

        selectedCity2 = { name: d.name, lat: d.lat, lng: d.lng };
        // Do whatever you want with the selected city data here
        console.log("Selected City2:", selectedCity2);

        // Clear the search input and hide the results
        searchInput.property("value", "");
        searchResults.style("display", "none");

        handleSelectedCityUpdate(selectedCity);
        handleUpdatechart(selectedCity2);

      });

    // Merge new and existing results
    results.merge(newResults);

    // Show the results container
    searchResults.style("display", filteredCities.length ? "block" : "none");
  }, 300);

  // Attach the updateSearchResults function to the input field's input event
  searchInput.on("input", updateSearchResults);

  // Event listener for document click to close the search results
  document.addEventListener('click', function (event) {
    if (!searchResults.node().contains(event.target)) {
      searchResults.style("display", "none");
    }
  });

  // Event listener for escape key to close the search results
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      searchResults.style("display", "none");
    }
  });

});

// Provide a function to set the selectedCity callback
function setSelectedCityCallback(callback) {
    selectedCityCallback = callback;
  }

  function setSelectedCityCallback2(callback) {
    selectedCityCallback2 = callback;
  }
  
  // Export the function to set the selectedCity callback
  export { setSelectedCityCallback };
  export { setSelectedCityCallback2 };