const coordAInput = document.getElementById("coordA");
const coordBInput = document.getElementById("coordB");
const kspInput = document.getElementById("ksp");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const mapsLink = document.getElementById("mapsLink");
const copyBtn = document.getElementById("copyBtn");

// Parse koordinat dari input
function parseCoord(value) {
  const parts = value.split(",").map(p => parseFloat(p.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  return { lat: parts[0], lng: parts[1] };
}

// Cek apakah semua field sudah diisi
function updateButtonState() {
  searchBtn.disabled =
    !coordAInput.value ||
    !coordBInput.value ||
    !kspInput.value;
}

// FUNGSI BARU: Ambil landmark dari OpenStreetMap
async function getLandmark(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Ambil nama tempat yang paling relevan
    if (data.address) {
      // Prioritas: road > suburb > city
      return data.address.road || data.address.suburb || data.address.city || data.display_name;
    }
    return data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    console.error("Error fetching landmark:", error);
    return `${lat}, ${lng}`; // Fallback ke koordinat kalau gagal
  }
}

coordAInput.addEventListener("input", updateButtonState);
coordBInput.addEventListener("input", updateButtonState);
kspInput.addEventListener("input", updateButtonState);

// EVENT LISTENER BUTTON (UPDATED)
searchBtn.addEventListener("click", async () => {
  const a = parseCoord(coordAInput.value);
  const b = parseCoord(coordBInput.value);
  const ksp = kspInput.value.trim();

  if (!a || !b || !ksp) return;

  // Nonaktifkan button sementara
  searchBtn.disabled = true;
  searchBtn.textContent = "Loading...";

  // Hitung titik tengah
  const centerLat = (a.lat + b.lat) / 2;
  const centerLng = (a.lng + b.lng) / 2;

  // LANGKAH BARU: Ambil landmark dari titik tengah
  const landmark = await getLandmark(centerLat, centerLng);

  // Bikin Google Maps search link pakai landmark
  const query = encodeURIComponent(`${ksp} near ${landmark}`);
  const url = `https://www.google.com/maps/search/${query}`;

  mapsLink.href = url;
  mapsLink.textContent = url;

  resultDiv.style.display = "block";

  // Aktifkan button lagi
  searchBtn.disabled = false;
  searchBtn.textContent = "Find the middle point";
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(mapsLink.href);
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy Google Maps link";
  }, 1500);
});