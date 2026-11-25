const listings = [
  { id: 1, name: "Youth hockey stick, 50 flex", sport: "Hockey", price: 35, location: "Cedar Park", condition: "Great condition", icon: "🏒", art: "hockey" },
  { id: 2, name: "Size 4 match soccer ball", sport: "Soccer", price: 18, location: "Westfield", condition: "Like new", icon: "⚽", art: "soccer" },
  { id: 3, name: "Knee pads + ball set", sport: "Volleyball", price: 24, location: "Maple Grove", condition: "Good condition", icon: "🏐", art: "volleyball" },
  { id: 4, name: "Junior golf club set", sport: "Golf", price: 65, location: "Northside", condition: "Great condition", icon: "⛳", art: "golf" },
  { id: 5, name: "Baseball glove, youth size", sport: "Baseball", price: 28, location: "Riverdale", condition: "Good condition", icon: "⚾", art: "baseball" }
];

const grid = document.querySelector("#listing-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".sport-filter");
let activeSport = "All";

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleListings = listings.filter((item) => {
    const matchesSport = activeSport === "All" || item.sport === activeSport;
    const matchesSearch = `${item.name} ${item.sport} ${item.location}`.toLowerCase().includes(query);
    return matchesSport && matchesSearch;
  });

  grid.innerHTML = visibleListings.map((item) => `
    <article class="listing-card">
      <div class="listing-art art-${item.art}">
        <span class="listing-tag">${item.condition}</span>
        <span class="listing-emoji" aria-hidden="true">${item.icon}</span>
        <button class="listing-favorite" type="button" aria-label="Save ${escapeHtml(item.name)}" aria-pressed="false">♡</button>
      </div>
      <div class="listing-info">
        <p class="listing-sport">${escapeHtml(item.sport)}</p>
        <h3 class="listing-title">${escapeHtml(item.name)}</h3>
        <div class="listing-meta">
          <span class="listing-price">$${Number(item.price).toFixed(0)}</span>
          <span class="listing-location"><span aria-hidden="true">⌖</span>${escapeHtml(item.location)}</span>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleListings.length > 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSport = button.dataset.sport;
    filterButtons.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderListings();
    document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

searchInput.addEventListener("input", renderListings);

grid.addEventListener("click", (event) => {
  const button = event.target.closest(".listing-favorite");
  if (!button) return;
  const isFavorite = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(isFavorite));
  button.classList.toggle("is-favorite", isFavorite);
  button.textContent = isFavorite ? "♥" : "♡";
});

const sellForm = document.querySelector("#sell-form");
const feedback = document.querySelector("#form-feedback");

sellForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!sellForm.reportValidity()) return;

  const formData = new FormData(sellForm);
  const name = String(formData.get("name")).trim();
  const sport = String(formData.get("sport"));
  const price = Number(formData.get("price"));
  const location = String(formData.get("location")).trim();
  const sportIcons = { Hockey: "🏒", Soccer: "⚽", Volleyball: "🏐", Golf: "⛳", Baseball: "⚾" };
  const sportArt = { Hockey: "hockey", Soccer: "soccer", Volleyball: "volleyball", Golf: "golf", Baseball: "baseball" };

  if (!name || !location || !Number.isFinite(price) || price < 1 || price > 9999) {
    feedback.textContent = "Add a name, pickup area, and a price between $1 and $9,999.";
    feedback.classList.remove("success");
    return;
  }

  listings.unshift({
    id: Date.now(),
    name,
    sport,
    price,
    location,
    condition: "Just listed",
    icon: sportIcons[sport],
    art: sportArt[sport]
  });
  activeSport = "All";
  searchInput.value = "";
  filterButtons.forEach((button) => {
    const isActive = button.dataset.sport === "All";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderListings();
  feedback.textContent = "Preview added! Your demo listing is now at the top of the page.";
  feedback.classList.add("success");
  sellForm.reset();
  document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navLinks.classList.toggle("open", isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  }
});

const communitySlider = document.querySelector("#community-size");
const membersCount = document.querySelector("#members-count");

function updateCommunitySimulation() {
  const members = Number(communitySlider.value);
  const buyers = Math.round(members * 0.6);
  const sellers = Math.round(members * 0.4);
  const availableListings = sellers * 3;
  const potentialBuyersPerSeller = buyers / sellers;
  const progress = ((members - Number(communitySlider.min)) / (Number(communitySlider.max) - Number(communitySlider.min))) * 100;

  membersCount.textContent = members.toLocaleString("en-CA");
  document.querySelector("#buyers-count").textContent = buyers.toLocaleString("en-CA");
  document.querySelector("#sellers-count").textContent = sellers.toLocaleString("en-CA");
  document.querySelector("#listings-count").textContent = availableListings.toLocaleString("en-CA");
  document.querySelector("#buyers-per-seller").textContent = potentialBuyersPerSeller.toFixed(1);
  communitySlider.style.setProperty("--slider-progress", `${progress}%`);
}

communitySlider.addEventListener("input", updateCommunitySimulation);
updateCommunitySimulation();
renderListings();
