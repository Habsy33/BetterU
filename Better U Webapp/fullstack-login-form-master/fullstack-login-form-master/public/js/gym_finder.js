let map, infoWindow;
let markers = []; // Array to store markers

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.8642, lng: -4.2518 }, // Default center (Glasgow, United Kingdom)
    zoom: 15,
  });
  infoWindow = new google.maps.InfoWindow();

  // Set up event listener for the search button
  document.getElementById("searchBtn").addEventListener("click", searchGyms);
}

function searchGyms() {
  // Get the location input by the user
  const locationInput = document.getElementById("locationInput").value;

  // Geocode the user's input to get its latitude and longitude
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      const location = results[0].geometry.location;

      // Center the map to the user's location
      map.setCenter(location);

      // Display gyms around the user's location
      findGymsInArea(location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function findGymsInArea(pos) {
  const request = {
    location: pos,
    radius: '500', // Search within 500 meters radius
    type: ['gym'] // Specify the type as 'gym'
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Clear previous list and markers
      document.getElementById("sidePanel").innerHTML = "";
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
      }

      // Create markers for each gym and add to side panel
      results.forEach((gym) => {
        const marker = new google.maps.Marker({
          position: gym.geometry.location,
          map: map,
          title: gym.name,
        });

        // Add click event listener to marker
        marker.addListener("click", () => {
          showGymInfo(gym);
        });

        markers.push(marker);

        // Add gym to side panel
        const gymItem = document.createElement("div");
        gymItem.className = "gym-item";
        gymItem.textContent = gym.name;
        gymItem.addEventListener("click", () => {
          showGymInfo(gym);
        });
        document.getElementById("sidePanel").appendChild(gymItem);
      });
    } else {
      console.error("Places service request failed. Status:", status);
    }
  });
}

function showGymInfo(gym) {
  infoWindow.setContent(gym.name);
  infoWindow.setPosition(gym.geometry.location);
  infoWindow.open(map);
}
