const searchBtn = document.getElementById('searchBtn');
const timingsDiv = document.getElementById('timings');

// Function to fetch Namaz timings
async function fetchTimings(location, namaz) {
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${location}&country=Pakistan&method=2`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.code === 200) {
      console.log(data.data.timings); // Debugging API response
      displayTiming(data.data.timings, namaz);
      changeBackground(namaz); // Change background based on Namaz
    } else {
      timingsDiv.innerHTML = `<div class="alert alert-danger">Invalid Location. Please try again.</div>`;
    }
  } catch (error) {
    console.error('Error fetching namaz timings:', error);
    timingsDiv.innerHTML = `<div class="alert alert-danger">Error fetching data. Please check your connection.</div>`;
  }
}

// Convert 24-Hour to 12-Hour format
function convertTo12Hour(time) {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12; // Convert to 12-hour format
  return `${hour12}:${minute} ${period}`;
}

// Display specific namaz timing
function displayTiming(timings, namaz) {
  if (timings[namaz]) {
    const formattedTime = convertTo12Hour(timings[namaz]);
    timingsDiv.innerHTML = `
      <h4 class="mb-3">Time for ${namaz}:</h4>
      <div class="alert alert-success"><strong>${namaz}:</strong> ${formattedTime}</div>
    `;
  } else {
    timingsDiv.innerHTML = `<div class="alert alert-danger">Namaz not found. Please try again.</div>`;
  }
}

// Change background based on Namaz
function changeBackground(namaz) {
  let backgroundImage;

  if (namaz === 'Fajr') {
    backgroundImage = 'url("./image/fajr.jpg")';
  } else if (namaz === 'Dhuhr') {
    backgroundImage = 'url("./image/dhuhr.jpg")';
  } else if (namaz === 'Asr') {
    backgroundImage = 'url("./image/asr.jpg")';
  } else if (namaz === 'Maghrib') {
    backgroundImage = 'url("./image/maghrib.jpg")';
  } else if (namaz === 'Isha') {
    backgroundImage = 'url("./image/isha.jpg")';
  } else {
    backgroundImage = 'url("./image/default.jpeg")'; // Default background image
  }

  document.body.style.backgroundImage = backgroundImage;

  // Save the background to localStorage
  localStorage.setItem('backgroundImage', backgroundImage);
}

// Load background from localStorage on page load
function loadBackground() {
  const savedBackground = localStorage.getItem('backgroundImage');
  if (savedBackground) {
    document.body.style.backgroundImage = savedBackground;
  } else {
    // Default background if no saved background is found
    document.body.style.backgroundImage = 'url("./image/default.jpeg")';
  }
}

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
  const location = document.getElementById('location').value.trim();
  const namaz = document.getElementById('namaz').value.trim();

  if (location === '') {
    timingsDiv.innerHTML = `<div class="alert alert-warning">Please enter a location.</div>`;
  } else {
    fetchTimings(location, namaz);
  }
});

