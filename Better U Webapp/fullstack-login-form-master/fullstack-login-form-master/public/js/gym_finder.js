let map, infoWindow, autocomplete;
let markers = []; // Array to store markers

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation);

        // Find gyms near the user's location
        findGymsInArea(userLocation);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Initialize the autocomplete service
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("searchInput"),
    {
      types: ["geocode"], // Restrict to addresses for better search results
      fields: ["formatted_address", "geometry"],
    }
  );
  autocomplete.bindTo("bounds", map); // Bias the search to the map's viewport

  // Add listener to update map when a place is selected from the autocomplete dropdown
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      // Place details not found
      return;
    }

    // Center the map on the selected place
    map.setCenter(place.geometry.location);

    // Clear previous search results
    clearMarkers();
    infoWindow.close();

    // Find gyms near the selected place
    findGymsInArea(place.geometry.location);
  });
}

function findGymsInArea(pos) {
  const request = {
    location: pos,
    radius: '1000', // Search within 1000 meters radius
    type: ['gym'] // Specify the type as 'gym'
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Clear previous list and markers
      const sidePanel = document.getElementById("sidePanel");
      sidePanel.innerHTML = "";
      clearMarkers();

      // Create markers for each gym and add to side panel
      results.forEach((gym, index) => {
        const marker = new google.maps.Marker({
          position: gym.geometry.location,
          map: map,
          title: gym.name,
        });

        // Add click event listener to marker
        marker.addListener("click", () => {
          showGymInfo(gym);
          highlightMarker(marker);
        });

        markers.push(marker);

        // Add gym to side panel with styling
        const gymItem = document.createElement("div");
        gymItem.className = "gym-item";
        gymItem.innerHTML = `<span class="gym-number">${index + 1}</span> <span class="gym-name">${gym.name}</span>`;
        gymItem.addEventListener("click", () => {
          showGymInfo(gym);
          highlightMarker(marker);
        });
        sidePanel.appendChild(gymItem);
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

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
