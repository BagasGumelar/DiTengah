let generatedMapsUrl = "";

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function toDegrees(rad) {
  return rad * 180 / Math.PI;
}

function randomJakartaCoordinate() {
  const lat = -6.35 + Math.random() * 0.30;
  const lng = 106.65 + Math.random() * 0.35;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

window.onload = function () {
  document.getElementById("pointA").placeholder = randomJakartaCoordinate();
  document.getElementById("pointB").placeholder = randomJakartaCoordinate();
};

function validateForm() {
  const a = document.getElementById("pointA").value.trim();
  const b = document.getElementById("pointB").value.trim();
  const k = document.getElementById("keyword").value.trim();

  document.getElementById("searchBtn").disabled = !(a && b && k);
}

function parseLatLong(value) {
  const parts = value.split(",");
  if (parts.length !== 2) throw new Error("Format must be: lat, long");

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinate value");
  }

  return { lat, lng };
}

function geodesicMidpoint(lat1, lng1, lat2, lng2) {
  const φ1 = toRadians(lat1);
  const λ1 = toRadians(lng1);
  const φ2 = toRadians(lat2);
  const λ2 = toRadians(lng2);

  const x = Math.cos(φ1) * Math.cos(λ1) + Math.cos(φ2) * Math.cos(λ2);
  const y = Math.cos(φ1) * Math.sin(λ1) + Math.cos(φ2) * Math.sin(λ2);
  const z = Math.sin(φ1) + Math.sin(φ2);

  return {
    lat: toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDegrees(Math.atan2(y, x))
  };
}

function runSearch() {
  try {
    const A = parseLatLong(document.getElementById("pointA").value);
    const B = parseLatLong(document.getElementById("pointB").value);
    const keyword = document.getElementById("keyword").value;

    const midpoint = geodesicMidpoint(A.lat, A.lng, B.lat, B.lng);
    const zoom = 17;

    generatedMapsUrl =
      `https://www.google.com/maps/search/${encodeURIComponent(keyword)}` +
      `/@${midpoint.lat},${midpoint.lng},${zoom}z`;

    document.getElementById("result").innerHTML = `
      <strong>Midpoint:</strong><br/>
      ${midpoint.lat.toFixed(6)}, ${midpoint.lng.toFixed(6)}
      <br/><br/>
      <a href="${generatedMapsUrl}" target="_blank">Open in Google Maps</a>
      <button class="copy-btn" onclick="copyLink()" title="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"></rect>
          <rect x="2" y="2" width="13" height="13" rx="2"></rect>
        </svg>
      </button>
    `;

    document.getElementById("copyStatus").innerText = "";
  } catch (err) {
    alert(err.message);
  }
}

function copyLink() {
  navigator.clipboard.writeText(generatedMapsUrl);
  document.getElementById("copyStatus").innerText =
    "Link copied to clipboard";
}
