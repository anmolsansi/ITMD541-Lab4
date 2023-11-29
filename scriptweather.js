document.getElementById("searchButton").addEventListener("click", async function () {
  try {
    const locSearch = document.getElementById('searchBar').value;

    if (!locSearch) {
      throw new Error("Please enter a location");
    }

    const coordinates = await fetchCoordinates(locSearch);
    displayData(coordinates['lat'], coordinates['lon']);
  } catch (error) {
    console.error('Error:', error.message);
    // Provide user feedback, e.g., show an alert
    alert('Error: ' + error.message);
  }
});

document.getElementById("geoButton").addEventListener("click", async function () {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    displayData(latitude, longitude);
  } catch (error) {
    console.error("Error getting location:", error.message);
    // Provide user feedback, e.g., show an alert
    alert('Error getting location: ' + error.message);
  }
});

async function fetchCoordinates(location) {
  const apiUrl = `https://geocode.maps.co/search?q=${location}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Geocoding HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error('Location not found');
  }

  return data[0];
}

async function fetchData(lat, lon, date) {
  const apiUrl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${date}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Sunrise Sunset API HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

async function displayData(lat, lon) {
  try {
    const todayData = await fetchData(lat, lon, 'today');
    const tomorrowData = await fetchData(lat, lon, 'tomorrow');

    updateUI(todayData.results, tomorrowData.results);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // Provide user feedback, e.g., hide or clear result divs
    hideElement("todayInfo");
    hideElement("tomorrowInfo");
    hideElement("timezone");

    // Show an alert with the error message
    alert('Error fetching data: ' + error.message);
  }
}

function updateUI(todayData, tomorrowData) {
  const updateElement = (id, value, iconClass) => {
    try{
      const element = document.getElementById(id);
      element.innerHTML = `<i class="${iconClass}"></i> ${value}`;
  }catch (error) {
    console.error('Error:', error.message);
  }
  };

  updateElement('sunriseToday', "Sunrise: " + todayData.sunrise, 'fas fa-sun');
  updateElement('sunriseTomorrow', "Sunrise: " + tomorrowData.sunrise, 'fas fa-sun');

  updateElement('sunsetToday', "Sunset: " + todayData.sunset, 'fas fa-sun');
  updateElement('sunsetTomorrow', "Sunset: " + tomorrowData.sunset, 'fas fa-sun');

  updateElement('dawnToday', "Dawn: " + todayData.dawn, 'fas fa-arrow-up');
  updateElement('dawnTomorrow', "Dawn: " + tomorrowData.dawn, 'fas fa-arrow-up');

  updateElement('duskToday', "Dusk: " + todayData.dusk, 'fas fa-arrow-down');
  updateElement('duskTomorrow', "Dusk: " + tomorrowData.dusk, 'fas fa-arrow-down');

  updateElement('dayLengthToday', "Day Length: " + todayData.day_length, 'fas fa-clock');
  updateElement('dayLengthTomorrow', "Day Length: " + tomorrowData.day_length, 'fas fa-clock');

  updateElement('solarNoonToday', "Solar Noon: " + todayData.solar_noon, 'fas fa-sun');
  updateElement('solarNoonTomorrow', "Solar Noon: " + tomorrowData.solar_noon, 'fas fa-sun');

  updateElement('timezone', "Timezone: \t" + tomorrowData.timezone, 'fas fa-globe');

  showElement("todayInfo");
  showElement("tomorrowInfo");
  showElement("timezone");
}

function hideElement(id) {
  document.getElementById(id).style.display = "none";
}

function showElement(id) {
  document.getElementById(id).style.display = "block";
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
