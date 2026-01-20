const coordAInput = document.getElementById("coordA");
const coordBInput = document.getElementById("coordB");
const kspInput = document.getElementById("ksp");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const mapsLink = document.getElementById("mapsLink");
const copyBtn = document.getElementById("copyBtn");

function parseCoord(value) {
  const parts = value.split(",").map(p => parseFloat(p.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  return { lat: parts[0], lng: parts[1] };
}

function updateButtonState() {
  searchBtn.disabled =
    !coordAInput.value ||
    !coordBInput.value ||
    !kspInput.value;
}

coordAInput.addEventListener("input", updateButtonState);
coordBInput.addEventListener("input", updateButtonState);
kspInput.addEventListener("input", updateButtonState);

searchBtn.addEventListener("click", () => {
  const a = parseCoord(coordAInput.value);
  const b = parseCoord(coordBInput.value);
  const ksp = kspInput.value.trim();

  if (!a || !b || !ksp) return;

  const centerLat = (a.lat + b.lat) / 2;
  const centerLng = (a.lng + b.lng) / 2;

  const query = encodeURIComponent(`${ksp} near ${centerLat}, ${centerLng}`);
  const url = `https://www.google.com/maps/search/${query}`;

  mapsLink.href = url;
  mapsLink.textContent = url;

  resultDiv.style.display = "block";
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(mapsLink.href);
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy Google Maps link";
  }, 1500);
});
